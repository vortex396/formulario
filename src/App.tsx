import { useState } from 'react';
import { Moon, Sparkles, Shield, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from './lib/supabase';
import { validateCPF, validateEmail } from './utils/validation';

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jaConhecia: '',
    areaFoco: '',
    areaFocoOutro: '',
    comoConheceu: '',
    comoConheceuOutro: '',
    nomeCompleto: '',
    email: '',
    cpf: '',
    consentimentoLgpd: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.jaConhecia) {
        newErrors.jaConhecia = 'Por favor, selecione uma opção';
      }
    }

    if (currentStep === 2) {
      if (!formData.areaFoco) {
        newErrors.areaFoco = 'Por favor, selecione uma área de foco';
      }
      if (formData.areaFoco === 'Outra' && !formData.areaFocoOutro.trim()) {
        newErrors.areaFocoOutro = 'Por favor, especifique a área';
      }
    }

    if (currentStep === 3) {
      if (!formData.comoConheceu) {
        newErrors.comoConheceu = 'Por favor, selecione uma opção';
      }
      if (formData.comoConheceu === 'Outro' && !formData.comoConheceuOutro.trim()) {
        newErrors.comoConheceuOutro = 'Por favor, especifique como conheceu';
      }
    }

    if (currentStep === 4) {
      if (!formData.nomeCompleto.trim()) {
        newErrors.nomeCompleto = 'Nome completo é obrigatório';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'E-mail é obrigatório';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'E-mail inválido';
      }

      if (!formData.cpf.trim()) {
        newErrors.cpf = 'CPF é obrigatório';
      } else if (!validateCPF(formData.cpf)) {
        newErrors.cpf = 'CPF inválido';
      }

      if (!formData.consentimentoLgpd) {
        newErrors.consentimentoLgpd = 'Você precisa concordar com os termos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('tarot_clients')
        .insert([{
          ja_conhecia: formData.jaConhecia,
          area_foco: formData.areaFoco,
          area_foco_outro: formData.areaFocoOutro || null,
          como_conheceu: formData.comoConheceu,
          como_conheceu_outro: formData.comoConheceuOutro || null,
          nome_completo: formData.nomeCompleto,
          email: formData.email,
          cpf: formData.cpf,
          consentimento_lgpd: formData.consentimentoLgpd
        }]);

      if (error) throw error;

      setSuccess(true);
      setStep(1);
      setFormData({
        jaConhecia: '',
        areaFoco: '',
        areaFocoOutro: '',
        comoConheceu: '',
        comoConheceuOutro: '',
        nomeCompleto: '',
        email: '',
        cpf: '',
        consentimentoLgpd: false
      });

      setTimeout(() => {
        setSuccess(false);
      }, 8000);

    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <Moon className="w-10 h-10 text-purple-500" />
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-purple-900 mb-4">
            ✨ Receba seu Presente Espiritual + Consulta Gratuita ✨
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed">
            Antes de eu preparar sua leitura, quero te entregar um material exclusivo e garantir sua consulta gratuita para a próxima semana 💫
            <br />
            <span className="text-purple-600 font-medium">
              Preencha abaixo — é rápido, gratuito e seguro.
            </span>
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step >= num
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`w-12 h-1 mx-1 transition-all ${
                      step > num ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {success && (
          <div className="mb-8 p-6 bg-purple-100 border-2 border-purple-300 rounded-2xl text-center animate-fade-in">
            <Moon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <p className="text-purple-900 text-lg font-medium">
              🌙 Obrigado! Seus dados foram enviados com sucesso.
            </p>
            <p className="text-purple-700 mt-2">
              Seu material será enviado por e-mail e sua leitura gratuita será agendada.
            </p>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-purple-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold text-purple-900 mb-4">
                  Você já conhecia a Mãe Neusa / meu trabalho?
                </h2>
                <div className="space-y-3">
                  {[
                    { value: 'Sim, já fiz várias vezes', label: 'Sim, já fiz várias vezes' },
                    { value: 'Sim, uma vez', label: 'Sim, uma vez' },
                    { value: 'Não, nunca fiz', label: 'Não, nunca fiz' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-purple-400 ${
                        formData.jaConhecia === option.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-purple-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="jaConhecia"
                        value={option.value}
                        checked={formData.jaConhecia === option.value}
                        onChange={handleChange}
                        className="w-5 h-5 text-purple-600 focus:ring-2 focus:ring-purple-400"
                      />
                      <span className="text-gray-800 font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.jaConhecia && (
                  <p className="text-red-500 text-sm mt-2">{errors.jaConhecia}</p>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold text-purple-900 mb-4">
                  Qual área você quer que eu foque na sua leitura?
                </h2>
                <div className="space-y-3">
                  {[
                    'Amor / Relacionamentos',
                    'Trabalho / Carreira',
                    'Finanças / Dinheiro',
                    'Saúde / Bem-estar',
                    'Propósito / Vida espiritual',
                    'Outra'
                  ].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-purple-400 ${
                        formData.areaFoco === option
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-purple-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="areaFoco"
                        value={option}
                        checked={formData.areaFoco === option}
                        onChange={handleChange}
                        className="w-5 h-5 text-purple-600 focus:ring-2 focus:ring-purple-400"
                      />
                      <span className="text-gray-800 font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.areaFoco && (
                  <p className="text-red-500 text-sm mt-2">{errors.areaFoco}</p>
                )}
                {formData.areaFoco === 'Outra' && (
                  <div className="mt-4">
                    <input
                      type="text"
                      name="areaFocoOutro"
                      value={formData.areaFocoOutro}
                      onChange={handleChange}
                      placeholder="Especifique a área"
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        errors.areaFocoOutro ? 'border-red-400' : 'border-purple-200'
                      } focus:border-purple-400 focus:outline-none transition-colors`}
                    />
                    {errors.areaFocoOutro && (
                      <p className="text-red-500 text-sm mt-1">{errors.areaFocoOutro}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold text-purple-900 mb-4">
                  Como chegou até nós?
                </h2>
                <div className="space-y-3">
                  {[
                    'Indicação de amigo/familiar',
                    'Instagram / Facebook',
                    'Grupo / Comunidade (Telegram/WhatsApp)',
                    'Pesquisa no Google',
                    'Outro'
                  ].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-purple-400 ${
                        formData.comoConheceu === option
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-purple-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="comoConheceu"
                        value={option}
                        checked={formData.comoConheceu === option}
                        onChange={handleChange}
                        className="w-5 h-5 text-purple-600 focus:ring-2 focus:ring-purple-400"
                      />
                      <span className="text-gray-800 font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.comoConheceu && (
                  <p className="text-red-500 text-sm mt-2">{errors.comoConheceu}</p>
                )}
                {formData.comoConheceu === 'Outro' && (
                  <div className="mt-4">
                    <input
                      type="text"
                      name="comoConheceuOutro"
                      value={formData.comoConheceuOutro}
                      onChange={handleChange}
                      placeholder="Especifique como conheceu"
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        errors.comoConheceuOutro ? 'border-red-400' : 'border-purple-200'
                      } focus:border-purple-400 focus:outline-none transition-colors`}
                    />
                    {errors.comoConheceuOutro && (
                      <p className="text-red-500 text-sm mt-1">{errors.comoConheceuOutro}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-purple-900 mb-4">
                  Seus dados para receber o presente
                </h2>

                <div>
                  <label htmlFor="nomeCompleto" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nomeCompleto"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.nomeCompleto ? 'border-red-400' : 'border-purple-200'
                    } focus:border-purple-400 focus:outline-none transition-colors`}
                    placeholder="Seu nome completo"
                  />
                  {errors.nomeCompleto && (
                    <p className="text-red-500 text-sm mt-1">{errors.nomeCompleto}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.email ? 'border-red-400' : 'border-purple-200'
                    } focus:border-purple-400 focus:outline-none transition-colors`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cpf" className="block text-sm font-semibold text-gray-700 mb-2">
                    CPF para emissão da nota fiscal da leitura *
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.cpf ? 'border-red-400' : 'border-purple-200'
                    } focus:border-purple-400 focus:outline-none transition-colors`}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  {errors.cpf && (
                    <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="consentimentoLgpd"
                      checked={formData.consentimentoLgpd}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 rounded border-2 border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-400 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 leading-relaxed group-hover:text-purple-700 transition-colors">
                      Li e concordo com o uso dos meus dados para envio do material, consulta e emissão de nota fiscal, conforme a LGPD.
                    </span>
                  </label>
                  {errors.consentimentoLgpd && (
                    <p className="text-red-500 text-sm mt-2">{errors.consentimentoLgpd}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-purple-600 text-purple-600 font-bold hover:bg-purple-50 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Voltar
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                >
                  Próximo
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Enviando...' : 'Enviar e Receber Meu Presente'}
                </button>
              )}
            </div>
          </form>
        </div>

        <footer className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <p>
              ⚖️ Seus dados são protegidos conforme a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
