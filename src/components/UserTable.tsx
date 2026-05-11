"use client";

import { useState } from "react";
import { Trash2, UserCog, User, ShieldAlert } from "lucide-react";
import { updateUserRole, deleteUser } from "@/src/app/actions";

const ROLE_OPTIONS = [
  "customer",
  "manager",
  "admin"
];

export default function UserTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    await updateUserRole(id, newRole);
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Users</h1>
           <p className="text-sm text-slate-500 font-medium">Manage user accounts and roles</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-700 border-b border-slate-100">
                <th className="px-8 py-5">Name</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Joined</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        {user.role === "admin" ? <ShieldAlert className="w-4 h-4 text-red-500" /> : user.role === "manager" ? <UserCog className="w-4 h-4 text-indigo-500" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className="text-sm font-bold text-slate-900">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                    {user.email}
                  </td>
                  <td className="px-8 py-6">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`inline-flex items-center gap-1.5 ps-3 pe-8 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow cursor-pointer border-e-8 border-transparent ${
                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                        user.role === 'manager' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ROLE_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="bg-white text-slate-900 font-bold">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-8 py-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <p className="text-slate-500 font-medium">No users found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
