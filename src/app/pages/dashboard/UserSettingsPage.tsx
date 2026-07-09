import React from 'react';

export default function UserSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">Settings</h1>
        <p className="text-neutral-500">Manage your profile and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Profile Information */}
          <section>
            <h2 className="text-lg font-bold mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Sandeep"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="sandeep@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <button className="mt-4 px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-bold tracking-wide hover:bg-neutral-800 transition-colors">
              Save Changes
            </button>
          </section>

          <hr className="border-neutral-100" />

          {/* Password */}
          <section>
            <h2 className="text-lg font-bold mb-4">Change Password</h2>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Current Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">New Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <button className="mt-4 px-6 py-2.5 rounded-xl border border-neutral-200 text-neutral-900 text-sm font-bold tracking-wide hover:bg-neutral-50 transition-colors">
              Update Password
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
