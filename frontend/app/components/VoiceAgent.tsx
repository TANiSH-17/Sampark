'use client';

import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  MapPin,
  FileText,
  Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface VoiceAgentProps {
  publicKey: string;
  assistantId: string;
}

interface ComplaintCreated {
  id: string;
  complaint_number: string;
  category: string;
  location: string;
  status: string;
  created_at: string;
}

export default function VoiceAgent({ publicKey, assistantId }: VoiceAgentProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState('Ready to help');
  const [transcript, setTranscript] = useState<string[]>([]);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [lastCreatedComplaint, setLastCreatedComplaint] = useState<ComplaintCreated | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const vapiRef = useRef<Vapi | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript ONLY within the transcript container (not the page)
  useEffect(() => {
    if (transcriptEndRef.current && transcriptContainerRef.current) {
      // Only scroll the transcript container, not the entire page
      transcriptContainerRef.current.scrollTo({
        top: transcriptContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [transcript]);

  // Listen for real-time complaint creation
  useEffect(() => {
    const channel = supabase
      .channel('voice-complaints')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'complaints',
          filter: 'source=eq.voice'
        },
        (payload) => {
          console.log('🎉 New voice complaint created:', payload.new);
          setLastCreatedComplaint({
            id: payload.new.id,
            complaint_number: payload.new.complaint_number,
            category: payload.new.category,
            location: payload.new.location,
            status: payload.new.status,
            created_at: payload.new.created_at,
          });
          setIsProcessing(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!publicKey) return;

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      setIsCallActive(true);
      setStatus('🟢 Connected');
      setTranscript([]);
      setLastCreatedComplaint(null);
    });

    vapi.on('call-end', () => {
      setIsCallActive(false);
      setStatus('Call ended');
      setVolumeLevel(0);
      setIsProcessing(true); // Show processing while webhook creates complaint
      
      // Wait for complaint creation (max 10 seconds)
      setTimeout(() => {
        setIsProcessing(false);
      }, 10000);
    });

    vapi.on('speech-start', () => {
      setStatus('🎤 Listening...');
    });

    vapi.on('speech-end', () => {
      setStatus('🤖 Processing...');
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        const role = message.role === 'assistant' ? '🤖' : '👤';
        const speaker = message.role === 'assistant' ? 'Sampark' : 'You';
        const newLine = `${role} ${speaker}: ${message.transcript}`;
        
        setTranscript(prev => {
          const lastLine = prev[prev.length - 1];
          // Update last line if same speaker (streaming)
          if (lastLine && lastLine.startsWith(role)) {
            return [...prev.slice(0, -1), newLine];
          }
          return [...prev, newLine];
        });
      }
      
      // Detect if agent mentioned complaint number
      if (message.type === 'transcript' && message.role === 'assistant') {
        const text = message.transcript?.toLowerCase() || '';
        if (text.includes('complaint') && text.includes('registered')) {
          setStatus('✅ Complaint Registered!');
        }
      }
    });

    vapi.on('volume-level', (level) => {
      setVolumeLevel(level);
    });

    vapi.on('error', (error) => {
      console.error('Vapi error:', error);
      setStatus('❌ Error - Try again');
      setIsCallActive(false);
      setIsProcessing(false);
    });

    return () => {
      vapi.stop();
    };
  }, [publicKey]);

  const startCall = async () => {
    if (!vapiRef.current || !assistantId) {
      setStatus('⚠️ Not configured');
      return;
    }
    setStatus('📞 Connecting...');
    setLastCreatedComplaint(null);
    
    try {
      await vapiRef.current.start(assistantId);
    } catch (error) {
      console.error('Failed to start call:', error);
      setStatus('❌ Connection failed');
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  // Prevent page scroll when call is active
  useEffect(() => {
    if (isCallActive) {
      document.body.style.overflow = 'hidden';
      // Lock scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isCallActive]);

  return (
    <div className={`bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl shadow-2xl border-2 overflow-hidden transition-all duration-500 ${
      isCallActive 
        ? 'border-blue-400 shadow-blue-500/20 ring-4 ring-blue-500/10' 
        : 'border-slate-200'
    }`}>
      {/* Futuristic Header with Glow Effect */}
      <div className={`relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 overflow-hidden ${
        isCallActive ? 'shadow-lg shadow-blue-500/30' : ''
      }`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-[shimmer_3s_infinite]" />
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`relative p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 transition-all ${
              isCallActive ? 'scale-110 shadow-lg shadow-white/20' : ''
            }`}>
              <Phone className={`w-6 h-6 text-white transition-all ${
                isCallActive ? 'animate-pulse' : ''
              }`} />
              {isCallActive && (
                <div className="absolute inset-0 rounded-xl bg-white/20 animate-ping" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Sampark Voice Agent</h3>
              <p className="text-blue-100 text-sm font-medium">AI-Powered Complaint Helpline</p>
            </div>
          </div>
          {isCallActive && (
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <div className="relative">
                <Volume2 className="w-5 h-5 text-white" />
                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
              </div>
              <div className="w-20 h-2.5 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-white to-blue-100 transition-all duration-100 rounded-full"
                  style={{ width: `${Math.min(volumeLevel * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-white font-medium">
                {Math.round(volumeLevel * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={`p-6 transition-all duration-300 ${
        isCallActive ? 'bg-gradient-to-b from-white to-blue-50/20' : 'bg-white'
      }`}>
        {/* Enhanced Status Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
              isCallActive 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 shadow-sm shadow-green-500/20' 
                : status.includes('Error') || status.includes('failed')
                ? 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300'
                : isProcessing
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-300'
                : 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-slate-300'
            }`}>
              {isCallActive && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              )}
              {isProcessing && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <span>{status}</span>
            </span>
          </div>
          
          {isCallActive && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Live Call</span>
            </div>
          )}
        </div>

        {/* Enhanced Transcript Area - Futuristic Design */}
        <div 
          ref={transcriptContainerRef}
          className={`relative bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl p-5 mb-5 border-2 overflow-y-auto transition-all duration-300 ${
            isCallActive 
              ? 'h-64 border-blue-200 shadow-inner shadow-blue-500/10' 
              : 'h-56 border-slate-200'
          } scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent`}
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
          <div className="relative z-10">
            {transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                <div className={`relative mb-4 transition-all ${isCallActive ? 'scale-110' : ''}`}>
                  <Mic className={`w-12 h-12 opacity-50 ${isCallActive ? 'animate-pulse text-blue-500' : ''}`} />
                  {isCallActive && (
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                  )}
                </div>
                <p className="text-center font-semibold text-slate-600">
                  {isCallActive 
                    ? '🎤 Listening for speech...' 
                    : 'Start a call to register a complaint'}
                </p>
                <p className="text-xs mt-2 text-slate-500">Speak in Hindi or English</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transcript.map((line, i) => (
                  <div 
                    key={i} 
                    className={`flex gap-3 ${
                      line.startsWith('🤖') ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm transition-all ${
                      line.startsWith('🤖') 
                        ? 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-900 rounded-tl-sm border border-blue-200/50' 
                        : 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-900 rounded-tr-sm border border-green-200/50'
                    }`}>
                      {line}
                    </div>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Complaint Created Banner */}
        {lastCreatedComplaint && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-800">✅ Complaint Registered!</p>
                <div className="mt-2 space-y-1 text-sm text-green-700">
                  <p className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="font-mono font-bold">{lastCreatedComplaint.complaint_number}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {lastCreatedComplaint.category}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {lastCreatedComplaint.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Banner */}
        {isProcessing && !lastCreatedComplaint && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
              <div>
                <p className="font-medium text-amber-800">Processing your complaint...</p>
                <p className="text-sm text-amber-600">AI is analyzing your call to create a ticket</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Controls - Futuristic Design */}
        <div className="flex gap-3">
          {!isCallActive ? (
            <button
              onClick={startCall}
              disabled={!publicKey || !assistantId}
              className="group relative flex-1 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-500 hover:via-emerald-500 hover:to-green-500 disabled:from-slate-400 disabled:via-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Phone className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Start Call</span>
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`group relative px-8 py-5 rounded-xl font-semibold flex items-center gap-2.5 transition-all duration-300 border-2 ${
                  isMuted 
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-700 border-amber-400 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30' 
                    : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 border-slate-300 hover:border-slate-400 hover:shadow-md'
                } hover:scale-105 active:scale-95`}
              >
                {isMuted ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span className="text-sm">Unmute</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span className="text-sm">Mute</span>
                  </>
                )}
              </button>
              <button
                onClick={endCall}
                className="group relative flex-1 py-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:via-rose-500 hover:to-red-500 text-white rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <PhoneOff className="w-6 h-6 relative z-10" />
                <span className="relative z-10">End Call</span>
              </button>
            </>
          )}
        </div>

        {/* Enhanced Help Text */}
        {!isCallActive && (
          <div className="mt-5 pt-5 border-t border-slate-200/50">
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-600 text-center mb-1">
                🎤 <span className="font-semibold">Try saying:</span>
              </p>
              <p className="text-xs text-slate-500 text-center">
                &quot;Mere ghar ke paas kachra hai&quot; or &quot;There&apos;s garbage near my house&quot;
              </p>
              <p className="text-xs text-slate-400 text-center mt-2">
                The AI will ask for your location and create a complaint automatically
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
