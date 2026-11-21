import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Radio, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';

export const ArchitecturePage: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<string>('');

  const checkHealth = async () => {
    setLoading(true);
    try {
      const data = await api.getSystemHealth();
      setHealthData(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error('Error fetching system health:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      name: 'API Gateway',
      key: 'gateway',
      port: 4000,
      tech: 'Node.js + Express',
      role: 'Unified Entry Point, Request IDs, Route Forwarding, CORS, Failover'
    },
    {
      name: 'Identity Service',
      key: 'identity',
      port: 4001,
      tech: 'Node.js + SQLite',
      role: 'JWT Authentication, Passwords (bcrypt), Reader Profiles & Goal Setup'
    },
    {
      name: 'Catalog & Reading Service',
      key: 'catalog',
      port: 4002,
      tech: 'Node.js + SQLite + RabbitMQ',
      role: 'Books, Adaptations, Reviews, Shelves, Event Publisher (book.completed, book.rated)'
    },
    {
      name: 'Social Service (StoryLab)',
      key: 'social',
      port: 4003,
      tech: 'Node.js + SQLite + RabbitMQ',
      role: 'StoryLab Theories, Adaptation Pitches, Likes, Comments, Event Publisher (story.published)'
    },
    {
      name: 'Recommendation Service (NextRead)',
      key: 'recommendation',
      port: 4004,
      tech: 'Python + FastAPI + Scikit-Learn',
      role: 'Taste Vectors, Cosine Similarity, ShelfMatch, Idempotent Event Consumer'
    },
    {
      name: 'Engagement Service (ReadQuest)',
      key: 'engagement',
      port: 4005,
      tech: 'Node.js + SQLite + RabbitMQ',
      role: 'Yearly Reading Goals, Streaks, Challenges, Achievements, Notifications, Idempotent Event Consumer'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="border-b border-[#E8E3D9] dark:border-[#282522] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1.5">
            <Activity className="w-4 h-4" />
            <span>Distributed Systems Architecture</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            Microservices Presentation Deck
          </h1>
          <p className="text-xs sm:text-sm text-[#786F63] dark:text-[#A89F91] mt-2 max-w-2xl leading-relaxed">
            Live operational status, event-driven topology, data boundaries, and architectural decision rationale for university defense & technical interviews.
          </p>
        </div>

        <button
          onClick={checkHealth}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#722F37] text-white hover:bg-[#8B3A44] transition-all flex items-center gap-1.5 self-start md:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Ping Services</span>
        </button>
      </div>

      {/* Live Health Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            Live Microservices Status
          </h2>
          <span className="text-[11px] text-[#8A8175]">
            Last verified: {lastChecked || 'Just now'} (Polling every 10s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(svc => {
            let status = 'unknown';
            if (svc.key === 'gateway') {
              status = healthData?.gateway?.status || (healthData ? 'healthy' : 'unreachable');
            } else if (healthData?.services?.[svc.key]) {
              status = healthData.services[svc.key].status || 'degraded';
            }

            const isHealthy = status === 'healthy' || status === 'ok';

            return (
              <div 
                key={svc.key}
                className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-[#8A8175] bg-[#EFEAE1] dark:bg-[#25221E] px-2 py-0.5 rounded">
                      Port :{svc.port}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isHealthy 
                        ? 'bg-emerald-900/10 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300' 
                        : 'bg-amber-900/10 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300'
                    }`}>
                      {isHealthy ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-amber-600" />}
                      <span className="capitalize">{status}</span>
                    </span>
                  </div>

                  <h3 className="font-editorial text-base font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
                    {svc.name}
                  </h3>
                  <div className="text-[11px] font-medium text-[#722F37] dark:text-[#C5A059] mt-0.5">
                    {svc.tech}
                  </div>
                </div>

                <p className="text-[11px] text-[#6B6357] dark:text-[#A89F91] leading-relaxed border-t border-[#E8E3D9]/60 dark:border-[#2D2A26]/60 pt-2">
                  {svc.role}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visual Architecture Diagram */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#F5F1E9] dark:bg-[#171513] border border-[#E8E3D9] dark:border-[#282522] space-y-6">
        <div>
          <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            Distributed Event-Driven Topology
          </h2>
          <p className="text-xs text-[#8A8175] mt-1">
            Separation of concerns: Synchronous HTTP for user queries vs Asynchronous AMQP for domain events
          </p>
        </div>

        {/* Node architecture schema */}
        <div className="space-y-6">
          {/* Layer 1: Client & Gateway */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#201D1A] border-2 border-[#C5A059] text-center w-56 shadow-sm">
              <div className="text-[10px] uppercase font-bold text-[#8A8175]">Client Layer</div>
              <div className="font-editorial font-bold text-sm text-[#1F1D1A] dark:text-[#EDE8E1]">
                React 19 + TypeScript + Vite
              </div>
              <div className="text-[10px] text-[#C5A059] font-medium mt-0.5">Port 3000</div>
            </div>

            <div className="text-xs font-mono text-[#8A8175] flex items-center gap-1">
              <span>REST / JSON</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#722F37]" />
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#201D1A] border-2 border-[#722F37] text-center w-56 shadow-sm">
              <div className="text-[10px] uppercase font-bold text-[#8A8175]">Reverse Proxy</div>
              <div className="font-editorial font-bold text-sm text-[#1F1D1A] dark:text-[#EDE8E1]">
                API Gateway
              </div>
              <div className="text-[10px] text-[#722F37] font-semibold mt-0.5">Port 4000</div>
            </div>
          </div>

          {/* Layer 2: Core Microservices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-[#E8E3D9] dark:border-[#282522]">
            <div className="p-3 rounded-xl bg-white dark:bg-[#1E1B18] border border-[#E8E3D9] dark:border-[#2D2A26] text-center">
              <div className="text-[10px] font-bold text-[#8A8175]">Identity Service</div>
              <div className="text-[11px] font-bold text-[#1F1D1A] dark:text-[#EDE8E1] mt-0.5">Port 4001</div>
              <div className="text-[9px] text-[#8A8175] mt-1">Owns identity.db</div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#1E1B18] border border-[#E8E3D9] dark:border-[#2D2A26] text-center ring-1 ring-[#722F37]">
              <div className="text-[10px] font-bold text-[#722F37]">Catalog / Reading</div>
              <div className="text-[11px] font-bold text-[#1F1D1A] dark:text-[#EDE8E1] mt-0.5">Port 4002</div>
              <div className="text-[9px] text-[#8A8175] mt-1">Publishes to AMQP</div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#1E1B18] border border-[#E8E3D9] dark:border-[#2D2A26] text-center">
              <div className="text-[10px] font-bold text-[#8A8175]">Social (StoryLab)</div>
              <div className="text-[11px] font-bold text-[#1F1D1A] dark:text-[#EDE8E1] mt-0.5">Port 4003</div>
              <div className="text-[9px] text-[#8A8175] mt-1">Owns social.db</div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#1E1B18] border border-[#E8E3D9] dark:border-[#2D2A26] text-center ring-1 ring-[#C5A059]">
              <div className="text-[10px] font-bold text-[#C5A059]">NextRead (Python)</div>
              <div className="text-[11px] font-bold text-[#1F1D1A] dark:text-[#EDE8E1] mt-0.5">Port 4004</div>
              <div className="text-[9px] text-[#8A8175] mt-1">Consumes AMQP</div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#1E1B18] border border-[#E8E3D9] dark:border-[#2D2A26] text-center ring-1 ring-emerald-600">
              <div className="text-[10px] font-bold text-emerald-600">Engagement / Quests</div>
              <div className="text-[11px] font-bold text-[#1F1D1A] dark:text-[#EDE8E1] mt-0.5">Port 4005</div>
              <div className="text-[9px] text-[#8A8175] mt-1">Consumes AMQP</div>
            </div>
          </div>

          {/* Layer 3: Message Broker */}
          <div className="p-4 rounded-2xl bg-[#1F1D1A] text-white border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-bold">
                🐰
              </div>
              <div>
                <div className="font-editorial text-base font-bold text-[#EDE8E1]">
                  RabbitMQ Message Broker (Exchange: bookend.events)
                </div>
                <div className="text-xs text-zinc-400">
                  Topic Routing Keys: book.completed, book.rated, reading.progress.updated, story.published
                </div>
              </div>
            </div>

            <div className="text-right text-[11px] font-mono text-[#C5A059]">
              Idempotent Handshake • Durable Queues
            </div>
          </div>
        </div>
      </section>

      {/* REST vs Asynchronous Messaging Matrix */}
      <section className="space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
          Architectural Decision Matrix: REST vs Messaging
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-[#E8E3D9] dark:border-[#2D2A26]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EFEAE1]/70 dark:bg-[#25221E] text-[#1F1D1A] dark:text-[#EDE8E1] border-b border-[#E8E3D9] dark:border-[#2D2A26]">
                <th className="p-3 font-editorial font-bold">Domain Interaction</th>
                <th className="p-3 font-editorial font-bold">Protocol</th>
                <th className="p-3 font-editorial font-bold">Producer / Caller</th>
                <th className="p-3 font-editorial font-bold">Consumer / Receiver</th>
                <th className="p-3 font-editorial font-bold">Architectural Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3D9]/60 dark:divide-[#2D2A26]/60 bg-[#FAF7F2] dark:bg-[#1A1816]">
              <tr>
                <td className="p-3 font-semibold text-[#1F1D1A] dark:text-[#EDE8E1]">User Authentication & Profile</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-bold">REST</span></td>
                <td className="p-3 text-[#5C554D]">Client / Gateway</td>
                <td className="p-3 text-[#5C554D]">Identity Service</td>
                <td className="p-3 text-[#786F63]">Immediate synchronous response required to issue JWT bearer token.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#1F1D1A] dark:text-[#EDE8E1]">Catalog Fetch & Search</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-bold">REST</span></td>
                <td className="p-3 text-[#5C554D]">Client / Gateway</td>
                <td className="p-3 text-[#5C554D]">Catalog Service</td>
                <td className="p-3 text-[#786F63]">Synchronous query needed immediately to render books and filters.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#1F1D1A] dark:text-[#EDE8E1]">Book Marked Completed</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-bold">RabbitMQ</span></td>
                <td className="p-3 text-[#5C554D]">Catalog Service</td>
                <td className="p-3 text-[#5C554D]">NextRead & Engagement</td>
                <td className="p-3 text-[#786F63]">Asynchronous event. User request does NOT wait for taste recalculation or achievement checks.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#1F1D1A] dark:text-[#EDE8E1]">Book Rated (1-5 Stars)</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-bold">RabbitMQ</span></td>
                <td className="p-3 text-[#5C554D]">Catalog Service</td>
                <td className="p-3 text-[#5C554D]">NextRead Service</td>
                <td className="p-3 text-[#786F63]">Event distribution decouples catalog write from mathematical taste vector recalibration.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#1F1D1A] dark:text-[#EDE8E1]">StoryLab Published</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-bold">RabbitMQ</span></td>
                <td className="p-3 text-[#5C554D]">Social Service</td>
                <td className="p-3 text-[#5C554D]">Engagement Service</td>
                <td className="p-3 text-[#786F63]">Evaluates "StoryLab Pioneer" achievement and dispatches notifications asynchronously.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#1F1D1A] dark:text-[#EDE8E1]">NextRead & ShelfMatch</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-bold">REST</span></td>
                <td className="p-3 text-[#5C554D]">Client / Gateway</td>
                <td className="p-3 text-[#5C554D]">Recommendation Service</td>
                <td className="p-3 text-[#786F63]">Immediate calculation read required for user viewing the NextRead screen.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Idempotency & Fault Isolation Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] space-y-3">
          <div className="flex items-center gap-2 text-[#722F37] dark:text-[#C5A059]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-editorial text-lg font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              Strict Event Idempotency
            </h3>
          </div>
          <p className="text-xs text-[#5C554D] dark:text-[#A89F91] leading-relaxed">
            In distributed networks, message brokers enforce at-least-once delivery. To prevent duplicate achievement unlocks, doubled streak counters, or duplicated notifications, both Recommendation and Engagement services maintain a durable <code className="font-mono bg-[#EFEAE1] dark:bg-[#25221E] px-1 py-0.5 rounded text-[11px]">processed_events</code> log. If an event is re-delivered, it is safely acknowledged and discarded without secondary mutations.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] space-y-3">
          <div className="flex items-center gap-2 text-[#722F37] dark:text-[#C5A059]">
            <Zap className="w-5 h-5" />
            <h3 className="font-editorial text-lg font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              Graceful Fault Isolation
            </h3>
          </div>
          <p className="text-xs text-[#5C554D] dark:text-[#A89F91] leading-relaxed">
            If the Python Recommendation Service or Notification consumer is temporarily cold or restarting, users can still log in, discover books, update shelves, and write StoryLab theories without interruption. Outgoing events are buffered in memory and in RabbitMQ queues, processing reliably the moment downstream services recover.
          </p>
        </div>
      </section>
    </div>
  );
};
