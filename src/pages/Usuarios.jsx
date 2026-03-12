import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const buscarUsuarios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('perfis').select('*');
      if (error) throw error;
      setUsuarios(data);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const alterarRole = async (id, novaRole) => {
    try {
      const { error } = await supabase
        .from('perfis')
        .update({ role: novaRole })
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Perfil atualizado!");
      buscarUsuarios();
    } catch (error) {
      toast.error("Você não tem permissão para isso.");
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen w-full">
      <Sidebar />
      <Toaster />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Gestão de Usuários</h1>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">E-mail</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nível de Acesso</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuarios.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => alterarRole(user.id, user.role === 'admin' ? 'basico' : 'admin')}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Alternar Cargo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}