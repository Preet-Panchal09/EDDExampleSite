import React, { useState, useEffect } from 'react'
import {
  Droplets,
  Gauge,
  Thermometer,
  Activity,
  Power,
  AlertTriangle,
  CheckCircle2,
  Settings,
  LayoutDashboard,
  Waves,
  FlaskConical,
  Cylinder,
  ArrowRight,
  Filter,
  Zap,
  Beaker,
} from 'lucide-react'

// Mock live data (presentation demo)
const useMockData = () => {
  const [data, setData] = useState({
    pH: 6.2,
    ec: 1.8,
    flow: 12.4,
    tankLevel: 78,
    temperature: 22.4,
    valveOpen: true,
    inlinePump: true,
    dosingA: false,
    dosingB: false,
    dosingAcid: false,
    farms: [
      { id: 1, status: 'active', moisture: 68, lastFeed: '14 min ago' },
      { id: 2, status: 'active', moisture: 72, lastFeed: '14 min ago' },
      { id: 3, status: 'active', moisture: 65, lastFeed: '14 min ago' },
      { id: 4, status: 'idle', moisture: 81, lastFeed: '42 min ago' },
      { id: 5, status: 'active', moisture: 70, lastFeed: '14 min ago' },
    ],
  })

  // Simulate slight live changes for presentation feel
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        pH: +(prev.pH + (Math.random() - 0.5) * 0.04).toFixed(2),
        ec: +(prev.ec + (Math.random() - 0.5) * 0.03).toFixed(2),
        flow: +(Math.max(0, prev.flow + (Math.random() - 0.5) * 0.4)).toFixed(1),
        tankLevel: Math.min(100, Math.max(40, prev.tankLevel + (Math.random() - 0.5) * 0.3)),
      }))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return data
}

function StatusBadge({ status }) {
  const styles = {
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    idle: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    offline: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.idle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-400 animate-pulse-soft' : status === 'warning' ? 'bg-amber-400' : 'bg-slate-400'}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function MetricCard({ icon: Icon, label, value, unit, status = 'normal', sub }) {
  const statusColor = {
    normal: 'text-emerald-400',
    warning: 'text-amber-400',
    critical: 'text-rose-400',
  }
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-slate-800/80">
          <Icon className="w-5 h-5 text-slate-300" />
        </div>
        {status !== 'normal' && (
          <span className={`text-xs font-medium ${statusColor[status]}`}>
            {status === 'warning' ? 'Check' : 'Alert'}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tracking-tight text-white">{value}</span>
        <span className="text-sm text-slate-500">{unit}</span>
      </div>
      {sub && <p className="text-xs text-slate-500 mt-2">{sub}</p>}
    </div>
  )
}

function DeviceCard({ title, subtitle, status, icon: Icon, active }) {
  return (
    <div className={`relative bg-slate-900/60 border rounded-xl p-4 transition-all ${
      active ? 'border-emerald-500/40 shadow-[0_0_20px_-8px_rgba(16,185,129,0.3)]' : 'border-slate-800'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${active ? 'bg-emerald-500/15' : 'bg-slate-800'}`}>
          <Icon className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{title}</p>
          <p className="text-xs text-slate-500 truncate">{subtitle}</p>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-emerald-400 animate-pulse-soft' : 'bg-slate-600'}`} />
      </div>
    </div>
  )
}

function FarmCard({ farm }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Cylinder className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-white">Flex Farm {farm.id}</span>
        </div>
        <StatusBadge status={farm.status} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Moisture</span>
          <span className="text-slate-300">{farm.moisture}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${farm.moisture}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 pt-1">Last feed · {farm.lastFeed}</p>
      </div>
    </div>
  )
}

export default function App() {
  const data = useMockData()
  const [activeNav, setActiveNav] = useState('overview')

  const pHStatus = data.pH < 5.5 || data.pH > 6.8 ? 'warning' : 'normal'
  const ecStatus = data.ec < 1.2 || data.ec > 2.4 ? 'warning' : 'normal'

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-slate-800/80 bg-slate-950/80 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">EDD Control</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Flex Farm System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'sensors', label: 'Sensors', icon: Activity },
            { id: 'pumps', label: 'Pumps & Dosing', icon: Waves },
            { id: 'farms', label: 'Flex Farms', icon: Cylinder },
            { id: 'alarms', label: 'Alarms', icon: AlertTriangle },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeNav === item.id
                  ? 'bg-slate-800/80 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            CM442 Online
          </div>
          <p className="text-[11px] text-slate-600 mt-1">System v2.4.1 · Demo</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800/80 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">System Overview</h1>
            <p className="text-sm text-slate-500">Nutrient delivery & monitoring · 5 Flex Farms</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">All Systems Nominal</span>
            </div>
            <div className="text-xs text-slate-500 tabular-nums">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Key Metrics */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Live Sensors</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                icon={Beaker}
                label="pH · CPS11E"
                value={data.pH.toFixed(2)}
                unit="pH"
                status={pHStatus}
                sub="Target 5.8 – 6.5"
              />
              <MetricCard
                icon={Zap}
                label="EC · CLS21E"
                value={data.ec.toFixed(2)}
                unit="mS/cm"
                status={ecStatus}
                sub="Target 1.5 – 2.2"
              />
              <MetricCard
                icon={Gauge}
                label="Flow · DMA15"
                value={data.flow.toFixed(1)}
                unit="L/min"
                sub="Needle valve regulated"
              />
              <MetricCard
                icon={Droplets}
                label="Tank Level · FMX11"
                value={Math.round(data.tankLevel)}
                unit="%"
                sub="Mixed nutrient solution"
              />
            </div>
          </section>

          {/* Process Flow Schematic */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Process Flow</h2>
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max text-xs">
                {[
                  { label: 'Building Water', icon: Droplets },
                  { label: 'Solenoid Valve', icon: Power, active: data.valveOpen },
                  { label: 'Filter', icon: Filter },
                  { label: 'Needle Valve', icon: Settings },
                  { label: 'DMA15 Flow', icon: Gauge },
                  { label: 'CPS11E pH', icon: Beaker },
                  { label: 'CLS21E EC', icon: Zap },
                  { label: 'Flex Farms', icon: Cylinder },
                ].map((step, i, arr) => (
                  <React.Fragment key={step.label}>
                    <div className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg border ${
                      step.active ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700/50'
                    }`}>
                      <step.icon className={`w-4 h-4 ${step.active ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className={`whitespace-nowrap ${step.active ? 'text-emerald-300' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-[11px] text-slate-600 mt-4">
                Water path → dosing loop returns via In-line Pump & Tank · Controlled by CM442
              </p>
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Controller & Valves */}
            <section className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Controller & Actuators</h2>
              <div className="space-y-3">
                <DeviceCard
                  title="CM442 Controller"
                  subtitle="Central process controller"
                  icon={Activity}
                  active={true}
                />
                <DeviceCard
                  title="Solenoid Water Valve"
                  subtitle={data.valveOpen ? 'Open · Supply active' : 'Closed'}
                  icon={Power}
                  active={data.valveOpen}
                />
                <DeviceCard
                  title="In-line Pump"
                  subtitle="Circulation · Tank ↔ Line"
                  icon={Waves}
                  active={data.inlinePump}
                />
              </div>
            </section>

            {/* Dosing Pumps */}
            <section className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dosing Pumps</h2>
              <div className="space-y-3">
                <DeviceCard
                  title="Nutrient A"
                  subtitle="Macronutrients · Idle"
                  icon={FlaskConical}
                  active={data.dosingA}
                />
                <DeviceCard
                  title="Nutrient B"
                  subtitle="Micronutrients · Idle"
                  icon={FlaskConical}
                  active={data.dosingB}
                />
                <DeviceCard
                  title="Acidic Solution"
                  subtitle="pH correction · Idle"
                  icon={Beaker}
                  active={data.dosingAcid}
                />
              </div>
            </section>

            {/* Tank */}
            <section className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mixing Tank</h2>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-lg bg-slate-800">
                    <Cylinder className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Nutrient Tank</p>
                    <p className="text-xs text-slate-500">FMX11 Level Sensor</p>
                  </div>
                </div>

                {/* Tank visual */}
                <div className="relative h-36 bg-slate-800/80 rounded-lg border border-slate-700 overflow-hidden mb-4">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-600/80 to-emerald-400/50 transition-all duration-1000"
                    style={{ height: `${data.tankLevel}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-white drop-shadow-lg">
                      {Math.round(data.tankLevel)}%
                    </span>
                  </div>
                  {/* Level marks */}
                  <div className="absolute right-2 top-2 text-[10px] text-slate-500">100%</div>
                  <div className="absolute right-2 bottom-2 text-[10px] text-slate-500">0%</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/50 rounded-lg px-3 py-2">
                    <p className="text-slate-500">Capacity</p>
                    <p className="text-slate-200 font-medium">500 L</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg px-3 py-2">
                    <p className="text-slate-500">Drain</p>
                    <p className="text-slate-200 font-medium">Ready</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Flex Farms */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Flex Farms</h2>
              <span className="text-xs text-slate-500">5 units · 4 active</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {data.farms.map((farm) => (
                <FarmCard key={farm.id} farm={farm} />
              ))}
            </div>
          </section>

          {/* Recent Events */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Recent Events</h2>
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl divide-y divide-slate-800/80">
              {[
                { time: '14:32:08', msg: 'Nutrient dosing cycle completed · Farms 1–3, 5', type: 'info' },
                { time: '14:18:41', msg: 'pH adjusted · Acidic solution dosed 12 ml', type: 'info' },
                { time: '13:55:02', msg: 'In-line pump started · Circulation active', type: 'ok' },
                { time: '13:42:17', msg: 'Solenoid valve opened · Supply restored', type: 'ok' },
                { time: '12:08:33', msg: 'EC reading stable at 1.82 mS/cm', type: 'info' },
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 text-sm">
                  <span className="text-xs text-slate-500 tabular-nums w-16 shrink-0">{event.time}</span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    event.type === 'ok' ? 'bg-emerald-400' : 'bg-slate-500'
                  }`} />
                  <span className="text-slate-300">{event.msg}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
