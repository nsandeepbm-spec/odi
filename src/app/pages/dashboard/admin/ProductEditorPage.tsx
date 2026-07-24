import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { Loader2, Package } from 'lucide-react';
import { PageHeader } from '../../../components/dashboard/shared';
import {
  createAdminProduct,
  updateAdminProduct,
  uploadAdminProductImage,
  type AdminProduct,
  type AdminProductStatus,
} from '../../../lib/api';

const STATUSES: AdminProductStatus[] = ['draft', 'live', 'coming_soon', 'archived'];

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function primaryImage(p: AdminProduct) {
  const img = p.images?.find((i) => i.is_primary) ?? p.images?.[0];
  return img?.url ?? null;
}

type FormState = {
  slug: string;
  name: string;
  volume: string;
  description: string;
  longDescription: string;
  priceInr: string;
  compareAtInr: string;
  stockQty: string;
  status: AdminProductStatus;
  tag: string;
  categories: string;
  features: string;
  kitContents: string;
  imageUrl: string;
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
  priceInr: '1299',
  compareAtInr: '',
  stockQty: '0',
  status: 'draft',
  tag: '',
  categories: '',
  features: '',
  kitContents: '',
  imageUrl: '',
  author: 'ODI Kids Editorial',
  publisher: 'ODI Stereo Labs',
  language: 'English',
  pages: '',
  ageRange: '6–12 years',
};

function productToForm(p: AdminProduct): FormState {
  const kitContentsText = (p.kit_contents as Array<any> | undefined)
    ?.map((k) => `${k.name} | ${k.qty}${k.detail ? ` | ${k.detail}` : ''}`)
    .join('\n') ?? '';

  return {
    slug: p.slug,
    name: p.name,
    volume: p.volume ?? '',
    description: p.description ?? '',
    longDescription: p.long_description ?? '',
    priceInr: String(p.price_paise / 100),
    compareAtInr: p.compare_at_paise != null ? String(p.compare_at_paise / 100) : '',
    stockQty: String(p.stock_qty),
    status: p.status,
    tag: p.tag ?? '',
    categories: (p.categories ?? []).join(', '),
    features: (p.features ?? []).join('\n'),
    kitContents: kitContentsText,
    imageUrl: primaryImage(p) ?? '',
    author: p.author ?? '',
    publisher: p.publisher ?? '',
    language: p.language ?? 'English',
    pages: p.pages != null ? String(p.pages) : '',
    ageRange: p.age_range ?? '',
  };
}

const fieldCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-neutral-900 bg-white transition-colors';
const labelCls = 'text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 mb-1.5 block';

export default function ProductEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const isEdit = id && id !== 'new';
  const initialProduct = location.state?.product as AdminProduct | undefined;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      if (initialProduct) {
        setForm(productToForm(initialProduct));
      } else {
        // Fallback: If page refreshed, we have no state. 
        // Redirect back to list since we don't have a GET /product/:id admin route yet.
        navigate('/dashboard/admin/products');
      }
    }
  }, [isEdit, initialProduct, navigate]);

  const patchForm = (patch: Partial<FormState>) => {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      if (patch.name !== undefined && !isEdit) {
        next.slug = slugify(patch.name);
      }
      return next;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError(null);
    try {
      const { url } = await uploadAdminProductImage(file);
      patchForm({ imageUrl: url });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
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

    const pricePaise = Math.round(price * 100);
    const comparePaise = compare != null ? Math.round(compare * 100) : null;
    const categories = form.categories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const features = form.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);
    const kitContents = form.kitContents
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, qty, detail] = line.split('|').map((s) => s.trim());
        return { name, qty: qty ? Number(qty) : 1, detail: detail || undefined };
      });
    const images = form.imageUrl.trim()
      ? [{ url: form.imageUrl.trim(), alt: form.name.trim(), sort_order: 0, is_primary: true }]
      : undefined;

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug,
        volume: form.volume.trim() || null,
        description: form.description.trim() || null,
        long_description: form.longDescription.trim() || null,
        price_paise: pricePaise,
        compare_at_paise: comparePaise,
        stock_qty: stock,
        status: form.status,
        tag: form.tag.trim() || null,
        categories,
        features,
        kit_contents: kitContents,
        author: form.author.trim() || null,
        publisher: form.publisher.trim() || null,
        language: form.language.trim() || null,
        pages: form.pages.trim() ? Number(form.pages) : null,
        age_range: form.ageRange.trim() || null,
        ...(images ? { images } : {}),
      };

      if (isEdit && id) {
        await updateAdminProduct(id, payload);
      } else {
        await createAdminProduct({ ...payload, images: images ?? [] });
      }
      navigate('/dashboard/admin/products');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl pb-16 mx-auto">


      <PageHeader
        title={isEdit ? 'Edit Product' : 'New'}
        accent={isEdit ? '' : 'Product.'}
        subtitle={isEdit ? `Editing ${initialProduct?.name}` : 'Create a new kit to sell on the store.'}
      />

      <div className="mt-6">
        <form onSubmit={handleSave}>
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Primary Details */}
            <div className="flex-1 flex flex-col gap-6 bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Name</label>
                  <input
                    className={fieldCls}
                    value={form.name}
                    onChange={(e) => patchForm({ name: e.target.value })}
                    placeholder="Space Explorer"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                </div>
              </div>

              <div>
                <label className={labelCls}>Short description</label>
                <textarea
                  className={`${fieldCls} min-h-[80px] resize-y`}
                  value={form.description}
                  onChange={(e) => patchForm({ description: e.target.value })}
                  placeholder="Journey through the cosmos in immersive 3D…"
                />
              </div>

              <div>
                <label className={labelCls}>Long description (Checkout & Details)</label>
                <textarea
                  className={`${fieldCls} min-h-[120px] resize-y`}
                  value={form.longDescription}
                  onChange={(e) => patchForm({ longDescription: e.target.value })}
                  placeholder="A fully immersive 3D adventure that brings the solar system to life..."
                />
              </div>

              <div className="pt-2">
                <label className={labelCls}>Primary image</label>
                <div className="relative group rounded-2xl border-2 border-dashed border-neutral-200 overflow-hidden bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  {form.imageUrl ? (
                    <div className="relative w-full aspect-[16/9] md:aspect-video bg-neutral-900">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className={`w-full h-full object-cover ${uploadingImage ? 'opacity-50' : ''}`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                        <button
                          type="button"
                          onClick={() => patchForm({ imageUrl: '' })}
                          className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-red-500 transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                      {uploadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Loader2 className="w-10 h-10 text-white animate-spin drop-shadow-md" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-[16/9] md:aspect-video cursor-pointer">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-10 h-10 text-neutral-400 animate-spin mb-4" />
                          <p className="text-base font-bold text-neutral-600">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Package className="w-12 h-12 text-neutral-300 mb-4 group-hover:text-indigo-500 transition-colors" />
                          <p className="text-base font-bold text-neutral-600">Click to upload image</p>
                          <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1.5">
                            PNG, JPG (max 5MB)
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className={labelCls}>Features (one per line)</label>
                  <textarea
                    className={`${fieldCls} min-h-[100px] resize-y`}
                    value={form.features}
                    onChange={(e) => patchForm({ features: e.target.value })}
                    placeholder="AR interactions&#10;Immersive 3D&#10;Audio guides"
                  />
                </div>
                <div>
                  <label className={labelCls}>Kit Contents (Name | Qty | Detail per line)</label>
                  <textarea
                    className={`${fieldCls} min-h-[100px] resize-y`}
                    value={form.kitContents}
                    onChange={(e) => patchForm({ kitContents: e.target.value })}
                    placeholder="VR Goggles | 1 | Includes straps&#10;Book | 1"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Organization & Pricing */}
            <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 flex flex-col gap-6">
              
              {/* Card 1: Status & Pricing */}
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <label className={labelCls}>Status</label>
                  <select
                    className={fieldCls}
                    value={form.status}
                    onChange={(e) => patchForm({ status: e.target.value as AdminProductStatus })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Price (₹)</label>
                    <input
                      className={fieldCls}
                      type="number"
                      min={0}
                      step="1"
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
                      step="1"
                      value={form.compareAtInr}
                      onChange={(e) => patchForm({ compareAtInr: e.target.value })}
                      placeholder="1599"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Stock Quantity</label>
                  <input
                    className={fieldCls}
                    type="number"
                    min={0}
                    step="1"
                    value={form.stockQty}
                    onChange={(e) => patchForm({ stockQty: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Card 2: Organization */}
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <label className={labelCls}>Categories</label>
                  <input
                    className={fieldCls}
                    value={form.categories}
                    onChange={(e) => patchForm({ categories: e.target.value })}
                    placeholder="space, science (comma-separated)"
                  />
                </div>
                
                <div>
                  <label className={labelCls}>Tag</label>
                  <input
                    className={fieldCls}
                    value={form.tag}
                    onChange={(e) => patchForm({ tag: e.target.value })}
                    placeholder="Bestseller"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Author</label>
                    <input
                      className={fieldCls}
                      value={form.author}
                      onChange={(e) => patchForm({ author: e.target.value })}
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
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Language</label>
                    <input
                      className={fieldCls}
                      value={form.language}
                      onChange={(e) => patchForm({ language: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Pages</label>
                    <input
                      className={fieldCls}
                      type="number"
                      min={0}
                      step="1"
                      value={form.pages}
                      onChange={(e) => patchForm({ pages: e.target.value })}
                      placeholder="e.g. 40"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {formError}
                </p>
              )}

              {/* Action Bar */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/admin/products')}
                  disabled={saving}
                  className="px-6 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-bold hover:bg-neutral-50 disabled:opacity-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 disabled:opacity-60 inline-flex items-center justify-center gap-2 shadow-md transition-colors"
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
        </form>
      </div>
    </div>
  );
}
