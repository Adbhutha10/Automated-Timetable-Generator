import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, CheckCircle2, Zap, Shield, ArrowRight, Users, Globe, 
  Lock, Settings, Share2, FileText, Layout, Command, 
  Clock, MapPin, Layers, BookOpen, ChevronRight, PlayCircle,
  BarChart3, BrainCircuit, Sparkles
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { 
      icon: <Zap className="text-amber-500" size={24} />, 
      title: "Instant Generation", 
      desc: "Engineered with advanced algorithms to build complete weekly schedules in seconds, not hours.",
      color: "bg-amber-50"
    },
    { 
      icon: <Shield className="text-emerald-500" size={24} />, 
      title: "Conflict-Free", 
      desc: "Our smart solver eliminates double-booked rooms or overlapping teacher sessions with 100% accuracy.",
      color: "bg-emerald-50"
    },
    { 
      icon: <Globe className="text-blue-500" size={24} />, 
      title: "Cloud Access", 
      desc: "Access your institution's schedule from anywhere, on any device, with real-time syncing capabilities.",
      color: "bg-blue-50"
    },
    { 
      icon: <BrainCircuit className="text-purple-500" size={24} />, 
      title: "AI Optimized", 
      desc: "Dynamically considers teacher preferences and student requirements for the most ergonomic schedule.",
      color: "bg-purple-50"
    },
    { 
      icon: <Layout className="text-rose-500" size={24} />, 
      title: "Multi-View", 
      desc: "Switch between Class, Teacher, and Room views instantly. High-resolution exports included.",
      color: "bg-rose-50"
    },
    { 
      icon: <Lock className="text-slate-600" size={24} />, 
      title: "Secure Portals", 
      desc: "Dedicated user roles ensure everyone sees exactly what they need with enterprise-grade security.",
      color: "bg-slate-100"
    }
  ];

  const steps = [
    { icon: <Command size={20} />, title: "Configure", desc: "Input your classes, teachers, rooms and subjects." },
    { icon: <Sparkles size={20} />, title: "Generate", desc: "Let our algorithm handle the complex logic." },
    { icon: <Share2 size={20} />, title: "Distribute", desc: "Publish instantly to all stakeholders." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden selection:bg-primary-100 selection:text-primary-700">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20 group-hover:scale-105 transition-transform">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Schedulify</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 mr-8">
             <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">Features</a>
             <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">How it works</a>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors px-4 py-2">Login</button>
            <button onClick={() => navigate('/signup')} className="btn-primary flex items-center !py-2.5 !px-6 text-sm">
              Get Started
              <ArrowRight className="ml-2" size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        {/* Abstract Background Blur */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary-200/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] bg-primary-100/30 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-10 animate-in fade-in slide-in-from-bottom-4">
            <Sparkles size={14} className="text-primary-600" />
            <span className="text-[10px] font-bold text-primary-700 uppercase tracking-[0.2em]">Trusted by 500+ Institutions</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[1.05] max-w-5xl mx-auto">
            Design your <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Academic Flow</span> with Schedulify.
          </h1>
          
          <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-12 font-medium">
            The intelligent engine for automated institutional scheduling. 
            Built for complexity, designed for simplicity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button onClick={() => navigate('/signup')} className="btn-primary h-16 px-12 text-lg flex items-center group relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                Start Building Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="btn-secondary h-16 px-12 text-lg flex items-center font-bold">
              <PlayCircle className="mr-2 text-primary-600" size={24} />
              Watch Demo
            </button>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-200/60 max-w-2xl mx-auto">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Optimized for</p>
             <div className="flex flex-wrap justify-center gap-10 opacity-60">
                <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all cursor-default">
                    <BookOpen size={20} className="text-slate-600" />
                    <span className="font-bold text-slate-900">Schools</span>
                </div>
                <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all cursor-default">
                    <Layers size={20} className="text-slate-600" />
                    <span className="font-bold text-slate-900">Universities</span>
                </div>
                <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all cursor-default">
                    <Users size={20} className="text-slate-600" />
                    <span className="font-bold text-slate-900">Training centers</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
          {[
            { label: "Timetables Built", value: "850k+" },
            { label: "Conflicts Solved", value: "2.5M+" },
            { label: "Active Institutions", value: "1,200+" },
            { label: "Efficiency Boost", value: "98%" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <p className="text-4xl md:text-5xl font-black text-primary-400">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Powerful by engine, <br className="hidden md:block" /> simple by design.</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Everything you need to manage your institution's pulse, all in one premium interface.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="glass-card group p-10 hover:border-primary-200/50 hover:bg-white transition-all cursor-default">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tight leading-[1.1]">
                From setup to export <br /> in minutes.
              </h2>
              <div className="space-y-12">
                {steps.map((step, i) => (
                  <div key={i} className="flex group">
                    <div className="mr-6">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
                        {step.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary-100/50 blur-3xl rounded-full" />
              <div className="relative glass-card bg-slate-900 border-slate-800 p-8 shadow-4xl aspect-[4/3] flex flex-col">
                <div className="flex items-center space-x-2 mb-8">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div className="flex-1 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Schedulify Explorer 2.0</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-5 gap-2 opacity-80">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`rounded-md ${i % 7 === 0 ? 'bg-primary-500/30 border border-primary-500/50' : 'bg-slate-800/50 border border-slate-700/50'} h-full transition-all hover:bg-primary-500/40`} />
                  ))}
                </div>
                <div className="mt-8 flex justify-between items-center bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                   <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                         <CheckCircle2 size={16} />
                      </div>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">No Conflicts Found</span>
                   </div>
                   <button className="text-[10px] font-bold text-primary-400 uppercase tracking-widest underline decoration-2 underline-offset-4">Refresh Grid</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary-600 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary-900/30">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:60px_60px]" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to optimize your institution?</h2>
              <p className="text-xl text-primary-100 mb-12 font-medium">Join 1,200+ schools and universities that trust Schedulify for their daily operations.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => navigate('/signup')} className="h-16 px-12 bg-white text-primary-600 font-bold rounded-2xl text-lg hover:bg-slate-50 transition-colors shadow-xl">
                  Get Started for Free
                </button>
                <button className="h-16 px-12 bg-primary-700/50 border border-primary-500 text-white font-bold rounded-2xl text-lg hover:bg-primary-700/70 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200/60 bg-white text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Calendar className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Schedulify</span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-6 max-w-sm">
              The world's most advanced automated timetable generator for modern education.
            </p>
            <div className="pt-8 border-t border-slate-100 w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <p>© 2026 Schedulify Inc. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
