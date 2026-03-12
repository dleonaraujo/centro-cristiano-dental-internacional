import React, { useState } from 'react';
import { Users, UserPlus, Calendar, Search, X } from 'lucide-react';

export default function DentalCenterSystem() {
  const [activeTab, setActiveTab] = useState('patients');
  const [patientType, setPatientType] = useState('');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  
  const [patients, setPatients] = useState([
    { id: 1, name: 'Juan Pérez', type: 'returning', visits: 3, lastVisit: '2024-12-15' },
    { id: 2, name: 'María González', type: 'returning', visits: 5, lastVisit: '2024-12-20' },
  ]);
  
  const [workers, setWorkers] = useState([
    { id: 1, name: 'Dr. Carlos Rodríguez', role: 'Dentista', specialty: 'Ortodoncia' },
    { id: 2, name: 'Dra. Ana Martínez', role: 'Dentista', specialty: 'Endodoncia' },
    { id: 3, name: 'Rosa López', role: 'Asistente', specialty: 'Asistencia General' },
  ]);

  const [newPatient, setNewPatient] = useState({
    name: '', phone: '', email: '', address: ''
  });

  const [newWorker, setNewWorker] = useState({
    name: '', role: '', specialty: '', phone: ''
  });

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (newPatient.name && patientType) {
      const patient = {
        id: patients.length + 1,
        name: newPatient.name,
        type: patientType,
        visits: patientType === 'new' ? 1 : 0,
        lastVisit: new Date().toISOString().split('T')[0],
        phone: newPatient.phone,
        email: newPatient.email,
        address: newPatient.address
      };
      setPatients([...patients, patient]);
      setNewPatient({ name: '', phone: '', email: '', address: '' });
      setPatientType('');
      setShowPatientForm(false);
    }
  };

  const handleAddWorker = (e) => {
    e.preventDefault();
    if (newWorker.name && newWorker.role) {
      const worker = {
        id: workers.length + 1,
        ...newWorker
      };
      setWorkers([...workers, worker]);
      setNewWorker({ name: '', role: '', specialty: '', phone: '' });
      setShowWorkerForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Centro Cristiano Dental Internacional</h1>
              <p className="text-gray-600 mt-1">Sistema de Gestión</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Arequipa, Perú</p>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString('es-PE')}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('patients')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'patients'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Users size={20} />
              Pacientes
            </button>
            <button
              onClick={() => setActiveTab('workers')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'workers'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <UserPlus size={20} />
              Trabajadores
            </button>
          </div>
        </div>

        {/* Patients Section */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            {!showPatientForm && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Registro de Paciente</h2>
                <p className="text-gray-600 mb-6">¿Es la primera vez que el paciente visita nuestro centro?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setPatientType('new');
                      setShowPatientForm(true);
                    }}
                    className="p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <UserPlus size={48} className="text-green-600" />
                      <span className="text-xl font-semibold text-gray-800">Primera Vez</span>
                      <span className="text-sm text-gray-600">Paciente nuevo</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setPatientType('returning');
                      setShowPatientForm(true);
                    }}
                    className="p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Calendar size={48} className="text-blue-600" />
                      <span className="text-xl font-semibold text-gray-800">Paciente Recurrente</span>
                      <span className="text-sm text-gray-600">Ya ha visitado antes</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {showPatientForm && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {patientType === 'new' ? 'Nuevo Paciente' : 'Paciente Recurrente'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowPatientForm(false);
                      setPatientType('');
                      setNewPatient({ name: '', phone: '', email: '', address: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={newPatient.phone}
                        onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newPatient.email}
                        onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={newPatient.address}
                      onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Registrar Paciente
                  </button>
                </form>
              </div>
            )}

            {/* Patients List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Lista de Pacientes</h3>
              <div className="space-y-3">
                {patients.map((patient) => (
                  <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{patient.name}</h4>
                        <p className="text-sm text-gray-600">
                          {patient.type === 'new' ? 'Paciente Nuevo' : `${patient.visits} visitas`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          patient.type === 'new' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {patient.type === 'new' ? 'Primera vez' : 'Recurrente'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Última visita: {patient.lastVisit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Workers Section */}
        {activeTab === 'workers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Personal del Centro</h2>
                <button
                  onClick={() => setShowWorkerForm(!showWorkerForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <UserPlus size={20} />
                  Agregar Personal
                </button>
              </div>

              {showWorkerForm && (
                <form onSubmit={handleAddWorker} className="mb-6 p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={newWorker.name}
                        onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cargo *
                      </label>
                      <select
                        value={newWorker.role}
                        onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Dentista">Dentista</option>
                        <option value="Asistente">Asistente</option>
                        <option value="Recepcionista">Recepcionista</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Especialidad
                      </label>
                      <input
                        type="text"
                        value={newWorker.specialty}
                        onChange={(e) => setNewWorker({ ...newWorker, specialty: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={newWorker.phone}
                        onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Agregar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowWorkerForm(false);
                        setNewWorker({ name: '', role: '', specialty: '', phone: '' });
                      }}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workers.map((worker) => (
                  <div key={worker.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{worker.name}</h4>
                        <p className="text-sm text-blue-600 font-medium">{worker.role}</p>
                        <p className="text-sm text-gray-600 mt-1">{worker.specialty}</p>
                        {worker.phone && (
                          <p className="text-xs text-gray-500 mt-2">{worker.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}