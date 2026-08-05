import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Loader2,
  Package,
  Plus,
  Trash2,
  ImageIcon,
  Check,
  AlertCircle,
} from 'lucide-react';
import { PageHeader, inrFromPaise } from '../../../components/dashboard/shared';
import {
  createAdminProduct,
  updateAdminProduct,
  uploadAdminProductImage,
  getAdminProduct,
  type AdminProductStatus,
} from '../../../lib/api';
import {
  editorImagesFromProduct,
  galleryFromUrls,
  imagesFromEditor,
  urlsFromGallery,
  type GallerySlot,
} from '../../../lib/productImages';
import { discountPercent } from '../../../data/products';
import { requestNotificationsRefresh } from '../../../components/dashboard/NotificationBell';

const STATUSES: AdminProductStatus[] = ['draft', 'live', 'coming_soon', 'archived'];
const MAX_GALLERY = 5;

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

type FormState = {
  slug: string;
  name: string;
  volume: string;
  description: string;
  longDescription: string;
  publisherBio: string;
  authorBio: string;
  priceInr: string;
  compareAtInr: string;
  stockQty: string;
  status: AdminProductStatus;
  tag: string;
  isFeatured: boolean;
  categories: string;
  features: string;
  kitContents: string;
  cardImageUrl: string;
  author: string;
  publisher: string;
  language: string;
  pages: string;
  ageRange: string;
};

const EMPTY_FORM: FormState = {
  slug: '',
  name: '',
  volume: '',
  description: '',
  longDescription: '',
  publisherBio: '',
  authorBio: '',
  priceInr: '1299',
  compareAtInr: '',
  stockQty: '0',
  status: 'draft',
  tag: '',
  isFeatured: false,
  categories: '',
  features: '',
  kitContents: '',
  cardImageUrl: '',
  author: 'ODI Kids Editorial',
  publisher: 'ODI Stereo Labs',
  language: 'English',
  pages: '',
  ageRange: '6–12 years',
};

function productToForm(p: Parameters<typeof editorImagesFromProduct>[0] & {
  slug: string;
  name: string;
  volume: string | null;
  description: string | null;
  long_description: string | null;
  publisher_bio: string | null;
  author_bio: string | null;
  editorial_review: string | null;
  editorial_review_author: string | null;
  editorial_review_rating: number | null;
  price_paise: number;
  compare_at_paise: number | null;
  stock_qty: number;
  status: AdminProductStatus;
  tag: string | null;
  is_featured?: boolean;
  categories: string[];
  features: string[];
  kit_contents: unknown;
  author: string | null;
  publisher: string | null;
  language: string | null;
  pages: number | null;
  age_range: string | null;
}): FormState {
  const { cardUrl, galleryUrls } = editorImagesFromProduct(p);
  const kitContentsText =
    (p.kit_contents as Array<{ name: string; qty: number; detail?: string }> | undefined)
      ?.map((k) => `${k.name} | ${k.qty}${k.detail ? ` | ${k.detail}` : ''}`)
      .join('\n') ?? '';

  return {
    slug: p.slug,
    name: p.name,
    volume: p.volume ?? '',
    description: p.description ?? '',
    longDescription: p.long_description ?? '',
    publisherBio: p.publisher_bio ?? '',
    authorBio: p.author_bio ?? '',
    priceInr: String(p.price_paise / 100),
    compareAtInr: p.compare_at_paise != null ? String(p.compare_at_paise / 100) : '',
    stockQty: String(p.stock_qty),
    status: p.status,
    tag: p.tag ?? '',
    isFeatured: Boolean(p.is_featured),
    categories: (p.categories ?? []).join(', '),
    features: (p.features ?? []).join('\n'),
    kitContents: kitContentsText,
    cardImageUrl: cardUrl,
    author: p.author ?? '',
    publisher: p.publisher ?? '',
    language: p.language ?? 'English',
    pages: p.pages != null ? String(p.pages) : '',
    ageRange: p.age_range ?? '',
  };
}

const fieldCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] text-sm outline-none focus:border-neutral-900 bg-[#0A0A0A] transition-colors';
const labelCls = 'text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 mb-1.5 block';

function SectionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0A0A0A] rounded-3xl border border-white/[0.06] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] relative z-10  p-5 sm:p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-black tracking-tight text-white">{title}</h2>
        {hint && <p className="text-xs text-neutral-500 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function statusLabel(s: AdminProductStatus) {
  return s.replace(/_/g, ' ');
}

export default function ProductEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== 'new');

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [gallery, setGallery] = useState<GallerySlot[]>([]);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingCard, setUploadingCard] = useState(false);
  const [uploadingGalleryIdx, setUploadingGalleryIdx] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !id) return;

    let cancelled = false;
    (async () => {
      setLoadingProduct(true);
      try {
        const product = await getAdminProduct(id);
        if (cancelled) return;
        setForm(productToForm(product));
        setGallery(galleryFromUrls(editorImagesFromProduct(product).galleryUrls));
      } catch (err) {
        if (!cancelled) {
          setFormError(err instanceof Error ? err.message : 'Failed to load product');
        }
      } finally {
        if (!cancelled) setLoadingProduct(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isEdit, id]);

  const patchForm = (patch: Partial<FormState>) => {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      if (patch.name !== undefined && !isEdit) {
        next.slug = slugify(patch.name);
      }
      return next;
    });
  };

  const uploadFile = async (file: File) => {
    const { url } = await uploadAdminProductImage(file);
    return url;
  };

  const handleCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCard(true);
    setFormError(null);
    try {
      const url = await uploadFile(file);
      patchForm({ cardImageUrl: url });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Card image upload failed');
    } finally {
      setUploadingCard(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIdx?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGalleryIdx(slotIdx ?? gallery.length);
    setFormError(null);
    try {
      const url = await uploadFile(file);
      setGallery((prev) => {
        if (slotIdx != null && slotIdx < prev.length) {
          return prev.map((s, i) => (i === slotIdx ? { ...s, url } : s));
        }
        if (prev.length >= MAX_GALLERY) return prev;
        return [...prev, { id: `g-${Date.now()}`, url }];
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gallery upload failed');
    } finally {
      setUploadingGalleryIdx(null);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const price = Number(form.priceInr);
    const compare = form.compareAtInr.trim() ? Number(form.compareAtInr) : null;
    const stock = Number(form.stockQty);
    const slug = (isEdit ? form.slug : form.slug || slugify(form.name)).trim();

    if (!form.name.trim()) {
      setFormError('Name is required');
      return;
    }
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setFormError('Slug must be lowercase-kebab-case (e.g. space-explorer)');
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setFormError('Enter a valid price in INR');
      return;
    }
    if (compare != null && (!Number.isFinite(compare) || compare < price)) {
      setFormError('Compare-at price must be ≥ selling price');
      return;
    }
    if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
      setFormError('Stock must be a whole number ≥ 0');
      return;
    }
    if (!form.cardImageUrl.trim()) {
      setFormError('Card image is required (hero for product cards & checkout)');
      return;
    }

    const pricePaise = Math.round(price * 100);
    const comparePaise = compare != null ? Math.round(compare * 100) : null;
    const categories = form.categories.split(',').map((c) => c.trim()).filter(Boolean);
    const features = form.features.split('\n').map((f) => f.trim()).filter(Boolean);
    const kitContents = form.kitContents
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, qty, detail] = line.split('|').map((s) => s.trim());
        return { name, qty: qty ? Number(qty) : 1, detail: detail || undefined };
      });

    const images = imagesFromEditor(form.cardImageUrl, urlsFromGallery(gallery), form.name.trim());

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug,
        volume: form.volume.trim() || null,
        description: form.description.trim() || null,
        long_description: form.longDescription.trim() || null,
        publisher_bio: form.publisherBio.trim() || null,
        author_bio: form.authorBio.trim() || null,
        price_paise: pricePaise,
        compare_at_paise: comparePaise,
        stock_qty: stock,
        status: form.status,
        tag: form.tag.trim() || null,
        is_featured: form.isFeatured,
        categories,
        features,
        kit_contents: kitContents,
        author: form.author.trim() || null,
        publisher: form.publisher.trim() || null,
        language: form.language.trim() || null,
        pages: form.pages.trim() ? Number(form.pages) : null,
        age_range: form.ageRange.trim() || null,
        images,
      };

      if (isEdit && id) {
        await updateAdminProduct(id, payload);
      } else {
        await createAdminProduct(payload);
      }
      if (form.status === 'live') {
        requestNotificationsRefresh();
      }
      navigate('/dashboard/admin/products');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const previewPrice = Number(form.priceInr);
  const previewMrp = form.compareAtInr.trim() ? Number(form.compareAtInr) : null;
  const previewOff =
    Number.isFinite(previewPrice) && previewMrp != null && Number.isFinite(previewMrp)
      ? discountPercent(Math.round(previewPrice * 100), Math.round(previewMrp * 100))
      : null;
  const checklist = [
    { ok: Boolean(form.name.trim()), label: 'Name' },
    { ok: Boolean(form.slug.trim()), label: 'Slug' },
    { ok: Boolean(form.cardImageUrl.trim()), label: 'Card image' },
    { ok: Number.isFinite(previewPrice) && previewPrice >= 0, label: 'Price' },
    { ok: form.status === 'live' ? gallery.length >= 0 && Boolean(form.cardImageUrl) : true, label: 'Ready for live' },
  ];

  if (loadingProduct) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">Loading product…</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl pb-20 mx-auto">
      <PageHeader
        title={isEdit ? 'Edit' : 'New'}
        accent="Product."
        subtitle="Left: catalog & checkout tabs. Right: preview, pricing, media, publish."
      />

      <form onSubmit={handleSave} className="mt-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* ── Left: content ─────────────────────────────────────────── */}
          <div className="xl:col-span-7 flex flex-col gap-5">
            <SectionCard title="Basics" hint="Name, URL slug, and short summary for cards.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Name</label>
                  <input
                    className={fieldCls}
                    value={form.name}
                    onChange={(e) => patchForm({ name: e.target.value })}
                    placeholder="Space Explorer"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <input
                    className={fieldCls}
                    value={form.slug}
                    onChange={(e) => patchForm({ slug: e.target.value.toLowerCase() })}
                    placeholder="space-explorer"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Volume</label>
                  <input
                    className={fieldCls}
                    value={form.volume}
                    onChange={(e) => patchForm({ volume: e.target.value })}
                    placeholder="Vol. 01"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Short description</label>
                  <textarea
                    className={`${fieldCls} min-h-[72px] resize-y`}
                    value={form.description}
                    onChange={(e) => patchForm({ description: e.target.value })}
                    placeholder="One or two lines for product cards…"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Checkout tabs"
              hint="Description · Publisher · Author on /checkout?product=…"
            >
              <div>
                <label className={labelCls}>Description tab</label>
                <textarea
                  className={`${fieldCls} min-h-[110px] resize-y`}
                  value={form.longDescription}
                  onChange={(e) => patchForm({ longDescription: e.target.value })}
                  placeholder="Full product story…"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelCls}>Language</label>
                  <input
                    className={fieldCls}
                    value={form.language}
                    onChange={(e) => patchForm({ language: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Age range</label>
                  <input
                    className={fieldCls}
                    value={form.ageRange}
                    onChange={(e) => patchForm({ ageRange: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Pages</label>
                  <input
                    className={fieldCls}
                    type="number"
                    min={0}
                    value={form.pages}
                    onChange={(e) => patchForm({ pages: e.target.value })}
                    placeholder="48"
                  />
                </div>
                <div>
                  <label className={labelCls}>Volume (meta)</label>
                  <input
                    className={fieldCls}
                    value={form.volume}
                    onChange={(e) => patchForm({ volume: e.target.value })}
                    placeholder="Vol. 01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="rounded-2xl border border-white/[0.04] bg-[#050505]/60 p-4 flex flex-col gap-3">
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-indigo-500">
                    Publisher tab
                  </p>
                  <div>
                    <label className={labelCls}>Name</label>
                    <input
                      className={fieldCls}
                      value={form.publisher}
                      onChange={(e) => patchForm({ publisher: e.target.value })}
                      placeholder="ODI Stereo Labs"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Bio</label>
                    <textarea
                      className={`${fieldCls} min-h-[88px] resize-y`}
                      value={form.publisherBio}
                      onChange={(e) => patchForm({ publisherBio: e.target.value })}
                      placeholder="About the publisher…"
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/[0.04] bg-[#050505]/60 p-4 flex flex-col gap-3">
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-indigo-500">
                    Author tab
                  </p>
                  <div>
                    <label className={labelCls}>Name</label>
                    <input
                      className={fieldCls}
                      value={form.author}
                      onChange={(e) => patchForm({ author: e.target.value })}
                      placeholder="ODI Kids Editorial"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Bio</label>
                    <textarea
                      className={`${fieldCls} min-h-[88px] resize-y`}
                      value={form.authorBio}
                      onChange={(e) => patchForm({ authorBio: e.target.value })}
                      placeholder="About the author…"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Kit & features" hint="Shown on checkout product details.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Features (one per line)</label>
                  <textarea
                    className={`${fieldCls} min-h-[120px] resize-y`}
                    value={form.features}
                    onChange={(e) => patchForm({ features: e.target.value })}
                    placeholder="3D Glasses Included&#10;Interactive Explorer Cards"
                  />
                </div>
                <div>
                  <label className={labelCls}>Kit contents (Name | Qty | Detail)</label>
                  <textarea
                    className={`${fieldCls} min-h-[120px] resize-y`}
                    value={form.kitContents}
                    onChange={(e) => patchForm({ kitContents: e.target.value })}
                    placeholder="Fact Book | 1 | Premium stereoscopic book"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Media"
              hint={`1 card hero + up to ${MAX_GALLERY} gallery images.`}
            >
              <div>
                <label className={labelCls}>Card image (required)</label>
                <div className="relative group rounded-2xl border-2 border-dashed border-white/[0.1] overflow-hidden bg-white/[0.02]">
                  {form.cardImageUrl ? (
                    <div className="relative aspect-[16/10]">
                      <img
                        src={form.cardImageUrl}
                        alt=""
                        className={`w-full h-full object-cover ${uploadingCard ? 'opacity-50' : ''}`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                        <label className="px-3 py-1.5 bg-[#0A0A0A] text-xs font-bold rounded-lg cursor-pointer">
                          Replace
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={handleCardUpload}
                            disabled={uploadingCard}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => patchForm({ cardImageUrl: '' })}
                          className="px-3 py-1.5 bg-red-900/200 text-white hover:bg-red-400 text-xs font-bold rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                      {uploadingCard && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-[16/10] cursor-pointer hover:bg-white/[0.04] transition-colors">
                      {uploadingCard ? (
                        <Loader2 className="w-8 h-8 text-neutral-400 animate-spin mb-2" />
                      ) : (
                        <Package className="w-9 h-9 text-neutral-300 mb-2" />
                      )}
                      <p className="text-sm font-bold text-neutral-300">Upload card</p>
                      <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
                        PNG JPG WebP · 5MB
                      </p>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleCardUpload}
                        disabled={uploadingCard}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`${labelCls} mb-0`}>
                    Gallery ({gallery.length}/{MAX_GALLERY})
                  </label>
                  {gallery.length < MAX_GALLERY && (
                    <label className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 cursor-pointer hover:text-indigo-700">
                      <Plus className="w-3.5 h-3.5" /> Add
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => handleGalleryUpload(e)}
                        disabled={uploadingGalleryIdx !== null}
                      />
                    </label>
                  )}
                </div>
                {gallery.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/[0.1] py-6 text-center text-xs text-neutral-500">
                    Optional thumbs under the hero on checkout.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {gallery.map((slot, idx) => (
                      <div
                        key={slot.id}
                        className="relative aspect-square rounded-xl border border-white/[0.1] overflow-hidden bg-white/[0.02] group"
                      >
                        <img src={slot.url} alt="" className="w-full h-full object-cover" />
                        {uploadingGalleryIdx === idx && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 bg-black/35 transition-opacity">
                          <label className="p-1.5 bg-[#0A0A0A] rounded-lg cursor-pointer shadow" title="Replace">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              className="hidden"
                              onChange={(e) => handleGalleryUpload(e, idx)}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setGallery((g) => g.filter((_, i) => i !== idx))}
                            className="p-1.5 bg-red-900/200 text-white hover:bg-red-400 rounded-lg shadow"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* ── Right: sticky preview / publish / checklist ──────────── */}
          <div className="xl:col-span-5 flex flex-col gap-5 xl:sticky xl:top-24">
            {/* Live preview */}
            <div className="bg-[#0A0A0A] rounded-3xl border border-white/[0.06] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] relative z-10  overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.04] flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                  Live preview
                </p>
                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                      form.status === 'live'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : form.status === 'coming_soon'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : form.status === 'archived'
                            ? 'bg-white/[0.04] text-neutral-500'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {statusLabel(form.status)}
                  </span>
                  {form.isFeatured && (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="aspect-[16/10] bg-white/[0.02] relative">
                {form.cardImageUrl ? (
                  <img src={form.cardImageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300 gap-2">
                    <Package className="w-10 h-10" />
                    <span className="text-xs font-bold">No card image</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                  {form.volume || 'Volume'}
                </p>
                <h3
                  className="text-xl font-black text-white mt-1 leading-tight"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  {form.name.trim() || 'Product name'}
                </h3>
                {form.description && (
                  <p className="text-sm text-neutral-500 mt-2 line-clamp-2">{form.description}</p>
                )}
                <div className="flex flex-wrap items-baseline gap-2 mt-3">
                  <span className="text-2xl font-black text-white">
                    {Number.isFinite(previewPrice)
                      ? inrFromPaise(Math.round(previewPrice * 100))
                      : '₹—'}
                  </span>
                  {previewMrp != null && Number.isFinite(previewMrp) && previewMrp > previewPrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      {inrFromPaise(Math.round(previewMrp * 100))}
                    </span>
                  )}
                  {previewOff != null && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {previewOff}% off
                    </span>
                  )}
                </div>
                {gallery.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                    {gallery.map((g) => (
                      <img
                        key={g.id}
                        src={g.url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-white/[0.1] shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <SectionCard title="Publish" hint="Status, Featured series, price (₹), and stock.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Status</label>
                  <select
                    className={fieldCls}
                    value={form.status}
                    onChange={(e) => patchForm({ status: e.target.value as AdminProductStatus })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel(s)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Featured series</label>
                  <button
                    type="button"
                    onClick={() => patchForm({ isFeatured: !form.isFeatured })}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                      form.isFeatured
                        ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                        : 'border-white/[0.1] bg-[#050505] text-neutral-400 hover:border-white/[0.2]'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-white">
                        {form.isFeatured ? 'On Featured' : 'Not featured'}
                      </span>
                      <span className="block text-[10px] mt-0.5 leading-snug opacity-80">
                        Immersive Series on /products · live or coming soon · pick ≤3
                      </span>
                    </span>
                    <span
                      className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
                        form.isFeatured ? 'bg-cyan-500' : 'bg-white/10'
                      }`}
                      aria-hidden
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          form.isFeatured ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Price (₹)</label>
                  <input
                    className={fieldCls}
                    type="number"
                    min={0}
                    value={form.priceInr}
                    onChange={(e) => patchForm({ priceInr: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>MRP (₹)</label>
                  <input
                    className={fieldCls}
                    type="number"
                    min={0}
                    value={form.compareAtInr}
                    onChange={(e) => patchForm({ compareAtInr: e.target.value })}
                    placeholder="1599"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1.5 leading-relaxed">
                    Optional. Must be ≥ selling price. Shows strike-through MRP and % off on
                    Products &amp; Checkout for this product only.
                  </p>
                  {previewOff != null && (
                    <p className="text-[10px] font-bold text-emerald-400 mt-1">
                      Storefront will show {previewOff}% off
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className={labelCls}>Stock</label>
                <input
                  className={fieldCls}
                  type="number"
                  min={0}
                  value={form.stockQty}
                  onChange={(e) => patchForm({ stockQty: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Badge tag</label>
                  <input
                    className={fieldCls}
                    value={form.tag}
                    onChange={(e) => patchForm({ tag: e.target.value })}
                    placeholder="Bestseller"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1.5">
                    Marketing badge only (not Featured series).
                  </p>
                </div>
                <div>
                  <label className={labelCls}>Categories</label>
                  <input
                    className={fieldCls}
                    value={form.categories}
                    onChange={(e) => patchForm({ categories: e.target.value })}
                    placeholder="space, science"
                  />
                </div>
              </div>
            </SectionCard>

            {/* Checklist + actions */}
            <div className="bg-[#0A0A0A] rounded-3xl border border-white/[0.06] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] relative z-10  p-5 flex flex-col gap-4">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                Checklist
              </p>
              <ul className="space-y-2">
                {checklist.map((item) => (
                  <li key={item.label} className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        item.ok ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/[0.04] text-neutral-300'
                      }`}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <span className={item.ok ? 'text-neutral-300 font-medium' : 'text-neutral-400'}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>

              {formError && (
                <div className="flex gap-2 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/admin/products')}
                  disabled={saving}
                  className="px-5 py-3 rounded-xl border border-white/[0.1] text-sm font-bold bg-black/40 hover:bg-white/[0.04] hover:border-white/[0.2] transition-all disabled:opacity-50 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                    </>
                  ) : isEdit ? (
                    'Save changes'
                  ) : (
                    'Create product'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
