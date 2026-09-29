"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  MessageCircle,
  Menu,
  X,
  CheckCircle2,
  Boxes,
  TrendingDown,
  SearchCheck,
  BarChart3,
  Workflow,
  PackageSearch,
  ClipboardList,
  BellRing,
  PieChart,
  ArrowRightLeft,
  LayoutGrid,
} from "lucide-react";
import {
  Button,
  buttonVariants,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Label,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";

const NAV_LINKS = [
  { href: "#beneficios", label: "Benefícios" },
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#previa", label: "A plataforma" },
  { href: "#contato", label: "Contato" },
];

const BENEFICIOS = [
  { icon: Boxes, title: "Materiais organizados por categoria", description: "Metais, polímeros, químicos ou embalagens — cada material com código, unidade e estoque mínimo definidos desde o cadastro." },
  { icon: TrendingDown, title: "Entradas e saídas sob controle", description: "Toda movimentação é registrada na hora, e o sistema impede saídas maiores que o saldo disponível." },
  { icon: SearchCheck, title: "Materiais em falta, fáceis de encontrar", description: "A situação de cada item é recalculada automaticamente a partir da quantidade e do mínimo." },
  { icon: BarChart3, title: "Indicadores sempre atuais", description: "Cards e gráficos mostram, em tempo real, a situação de todos os materiais cadastrados." },
  { icon: Workflow, title: "Decisões mais rápidas na produção", description: "Com visibilidade sobre o que falta, compras e produção reagem antes de uma linha parar." },
];

const FUNCIONALIDADES = [
  { icon: LayoutGrid, title: "Controle de matérias-primas", description: "Cadastro completo por código, categoria, unidade e níveis de estoque." },
  { icon: PieChart, title: "Indicadores de estoque", description: "Cards e gráficos atualizados a cada mudança no estoque." },
  { icon: PackageSearch, title: "Busca e filtros", description: "Encontre um material por nome ou código, combinando categoria e situação." },
  { icon: ArrowRightLeft, title: "Entradas e saídas", description: "Registre movimentações com validação de saldo, sem risco de estoque negativo." },
  { icon: BellRing, title: "Alertas de estoque", description: "Materiais em estoque baixo ou zerados aparecem sinalizados." },
  { icon: ClipboardList, title: "Gráficos por categoria", description: "Veja a distribuição dos materiais entre as 4 categorias." },
];

const AREAS_DE_INTERESSE = ["Produção", "Compras / Suprimentos", "Qualidade", "TI", "Direção / Gestão"];

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="16" width="8" height="13" rx="1.5" fill="hsl(var(--primary))" />
      <rect x="11" y="9" width="8" height="20" rx="1.5" fill="hsl(var(--copper))" />
      <rect x="21" y="1" width="8" height="28" rx="1.5" fill="hsl(var(--primary))" />
    </svg>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="font-display text-lg font-semibold">Fluxora</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <Link href="/demo" className={`hidden md:inline-flex ${buttonVariants()}`}>
          Acessar demonstração
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <nav className="container flex flex-col gap-1 border-t border-border py-3 md:hidden">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-md px-2 py-2.5 text-sm hover:bg-secondary">
              {l.label}
            </a>
          ))}
          <Link href="/demo" className={`mt-2 ${buttonVariants()}`} onClick={() => setOpen(false)}>
            Acessar demonstração
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

function Hero() {
  const amostra = [
    { codigo: "MP-004", material: "Tubo de aço inox 304", classe: "bg-state-normal/10 text-state-normal", label: "Normal" },
    { codigo: "MP-009", material: "Ácido sulfúrico técnico", classe: "bg-state-low/10 text-state-low", label: "Estoque baixo" },
    { codigo: "MP-011", material: "Óleo lubrificante industrial", classe: "bg-state-out/10 text-state-out", label: "Sem estoque" },
  ];
  return (
    <section className="border-b border-border">
      <div className="container grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
        <div className="opacity-0 animate-fade-up motion-reduce:opacity-100 motion-reduce:animate-none">
          <Badge variant="outline" className="mb-6 border-copper/40 text-copper">
            Controle de matéria-prima
          </Badge>
          <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Saiba exatamente quanto matéria-prima sua fábrica tem — antes que falte.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            A Fluxora reúne entradas, saídas e níveis mínimos de cada material em um só painel, para o time de
            produção não descobrir uma falta de estoque no meio do turno.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" className={buttonVariants({ size: "lg" })}>
              Experimentar a demonstração
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a href="#contato" className={buttonVariants({ size: "lg", variant: "outline" })}>
              <MessageCircle className="h-4 w-4" />
              Falar com o time comercial
            </a>
          </div>
        </div>
        <div className="opacity-0 animate-fade-up [animation-delay:120ms] motion-reduce:opacity-100 motion-reduce:animate-none rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <p className="font-display text-sm font-medium">Painel de estoque</p>
            <span className="h-2.5 w-2.5 rounded-full bg-state-normal" />
          </div>
          <ul className="divide-y divide-border">
            {amostra.map((item) => (
              <li key={item.codigo} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{item.codigo}</p>
                  <p className="text-sm">{item.material}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.classe}`}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section id="beneficios" className="border-b border-border bg-secondary/40">
      <div className="container grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="font-display text-sm font-medium text-copper">Por que a Fluxora</p>
          <h2 className="mt-3 max-w-sm font-display text-3xl font-semibold tracking-tight">
            Pensada para quem lida com estoque de matéria-prima todo dia
          </h2>
        </div>
        <div className="divide-y divide-border border-t border-border">
          {BENEFICIOS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4 py-6 first:pt-0 sm:gap-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-medium">{title}</h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="funcionalidades" className="border-b border-border">
      <div className="container py-16">
        <p className="font-display text-sm font-medium text-copper">Funcionalidades</p>
        <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold tracking-tight">
          Tudo que o time de produção precisa para acompanhar o estoque
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FUNCIONALIDADES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="hover:border-primary/40">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-copper/10 text-copper">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="pt-3">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Preview() {
  const stats = [
    { label: "Materiais cadastrados", value: "16" },
    { label: "Estoque normal", value: "9" },
    { label: "Estoque baixo", value: "4" },
    { label: "Sem estoque", value: "3" },
  ];
  const barras = [
    { label: "Metais", altura: 62 },
    { label: "Polímeros", altura: 48 },
    { label: "Químicos", altura: 40 },
    { label: "Embalagens", altura: 34 },
  ];
  return (
    <section id="previa" className="border-b border-border bg-ink text-white">
      <div className="container py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-sm font-medium text-copper-light">A plataforma</p>
            <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold tracking-tight">
              Um painel só, com tudo que está entrando e saindo do estoque
            </h2>
          </div>
          <Link href="/demo" className={buttonVariants({ variant: "copper", className: "w-fit" })}>
            Ver a demonstração completa
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                <p className="font-display text-2xl font-semibold">{s.value}</p>
                <p className="mt-1 text-xs text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex h-28 items-end gap-3 rounded-md border border-white/10 p-4">
            {barras.map((b) => (
              <div key={b.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-sm bg-copper-light/80" style={{ height: `${b.altura}%` }} />
                <span className="text-center text-[10px] text-white/50">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadForm() {
  const [campos, setCampos] = useState({ nome: "", email: "", empresa: "", area: "" });
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!campos.nome.trim() || !campos.email.includes("@") || !campos.empresa.trim() || !campos.area) {
      setErro("Preencha todos os campos com um e-mail válido.");
      return;
    }
    setErro("");
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-state-normal/30 bg-state-normal/5 px-6 py-12 text-center">
        <CheckCircle2 className="h-9 w-9 text-state-normal" />
        <p className="font-display text-lg font-medium">Solicitação recebida</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Nosso time comercial entra em contato em breve. Enquanto isso, explore a demonstração da plataforma.
        </p>
        <Button variant="outline" size="sm" onClick={() => setEnviado(false)} className="mt-2">
          Enviar outro contato
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div className="grid gap-1.5">
        <Label htmlFor="lead-nome">Nome</Label>
        <Input id="lead-nome" value={campos.nome} onChange={(e) => setCampos({ ...campos, nome: e.target.value })} placeholder="Seu nome completo" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="lead-email">E-mail corporativo</Label>
        <Input id="lead-email" type="email" value={campos.email} onChange={(e) => setCampos({ ...campos, email: e.target.value })} placeholder="voce@suaempresa.com" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="lead-empresa">Empresa</Label>
        <Input id="lead-empresa" value={campos.empresa} onChange={(e) => setCampos({ ...campos, empresa: e.target.value })} placeholder="Nome da indústria" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="lead-area">Área de interesse</Label>
        <Select value={campos.area} onValueChange={(v) => setCampos({ ...campos, area: v })}>
          <SelectTrigger id="lead-area">
            <SelectValue placeholder="Selecione uma área" />
          </SelectTrigger>
          <SelectContent>
            {AREAS_DE_INTERESSE.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {erro ? <p role="alert" className="text-sm text-destructive sm:col-span-2">{erro}</p> : null}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto">Solicitar contato</Button>
        <p className="mt-3 text-xs text-muted-foreground">Formulário de demonstração — nenhum dado é enviado a um servidor real.</p>
      </div>
    </form>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="container flex flex-col gap-6 py-12 sm:flex-row sm:justify-between">
        <div>
          <span className="font-display text-lg font-semibold text-white">Fluxora</span>
          <p className="mt-2 max-w-xs text-sm">Software de controle de matéria-prima para indústrias.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm sm:items-end">
          <Link href="/demo" className="hover:text-white">Demonstração</Link>
          <a href="#contato" className="hover:text-white">Falar com vendas</a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <p className="container text-xs text-white/40">
          © {new Date().getFullYear()} Fluxora. Empresa e dados fictícios, para fins de demonstração.
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Features />
        <Preview />
        <section id="contato" className="border-b border-border">
          <div className="container py-16">
            <p className="font-display text-sm font-medium text-copper">Fale com a gente</p>
            <h2 className="mt-3 max-w-md font-display text-3xl font-semibold tracking-tight">
              Conte sobre o seu estoque e veja como a Fluxora se encaixa
            </h2>
            <div className="mt-8 max-w-2xl rounded-lg border border-border bg-card p-6 sm:p-8">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
