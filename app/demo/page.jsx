"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Info,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Plus,
  ArrowRightLeft,
  Search,
  PackageOpen,
  Circle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Label,
  Badge,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui";
import { MATERIAIS_INICIAIS, CATEGORIAS } from "@/data/materiais";
import { SITUACOES, SITUACAO_LABEL, comSituacaoRecalculada } from "@/lib/helpers";

const TODAS = "todas";
const UNIDADES = ["kg", "g", "L", "m", "m²", "un", "ton"];
const CORES_SITUACAO = {
  [SITUACOES.NORMAL]: "hsl(var(--state-normal))",
  [SITUACOES.BAIXO]: "hsl(var(--state-low))",
  [SITUACOES.SEM_ESTOQUE]: "hsl(var(--state-out))",
};
const BADGE_VARIANTE = {
  [SITUACOES.NORMAL]: "normal",
  [SITUACOES.BAIXO]: "baixo",
  [SITUACOES.SEM_ESTOQUE]: "semEstoque",
};

/* Badge de situação (texto + cor) --------------------------------------- */
function SituacaoBadge({ situacao }) {
  return (
    <Badge variant={BADGE_VARIANTE[situacao]}>
      <Circle className="h-2 w-2 fill-current" />
      {SITUACAO_LABEL[situacao]}
    </Badge>
  );
}

/* Dialog: cadastrar novo material ---------------------------------------- */
function CadastrarMaterialDialog({ codigosExistentes, onCadastrar }) {
  const inicial = { codigo: "", material: "", categoria: "", unidade: "", quantidade: "", estoqueMinimo: "" };
  const [open, setOpen] = useState(false);
  const [campos, setCampos] = useState(inicial);
  const [erro, setErro] = useState("");

  function fechar() {
    setOpen(false);
    setCampos(inicial);
    setErro("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const codigo = campos.codigo.trim().toUpperCase();
    const nome = campos.material.trim();
    const quantidade = Number(campos.quantidade);
    const estoqueMinimo = Number(campos.estoqueMinimo);

    if (!codigo || !nome || !campos.categoria || !campos.unidade || campos.quantidade === "" || campos.estoqueMinimo === "") {
      setErro("Preencha todos os campos antes de cadastrar.");
      return;
    }
    if (codigosExistentes.includes(codigo)) {
      setErro(`Já existe um material com o código ${codigo}.`);
      return;
    }
    if (quantidade < 0 || estoqueMinimo < 0) {
      setErro("Quantidade e estoque mínimo não podem ser negativos.");
      return;
    }

    onCadastrar({ id: codigo, codigo, material: nome, categoria: campos.categoria, unidade: campos.unidade, quantidade, estoqueMinimo });
    fechar();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : fechar())}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Cadastrar material
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar material</DialogTitle>
          <DialogDescription>Entra imediatamente na tabela, nos cards e nos gráficos.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="novo-codigo">Código</Label>
              <Input id="novo-codigo" value={campos.codigo} onChange={(e) => setCampos({ ...campos, codigo: e.target.value })} placeholder="MP-017" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="novo-unidade">Unidade</Label>
              <Select value={campos.unidade} onValueChange={(v) => setCampos({ ...campos, unidade: v })}>
                <SelectTrigger id="novo-unidade"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {UNIDADES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="novo-material">Material</Label>
            <Input id="novo-material" value={campos.material} onChange={(e) => setCampos({ ...campos, material: e.target.value })} placeholder="Ex.: Chapa de aço galvanizado" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="novo-categoria">Categoria</Label>
            <Select value={campos.categoria} onValueChange={(v) => setCampos({ ...campos, categoria: v })}>
              <SelectTrigger id="novo-categoria"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="novo-quantidade">Quantidade disponível</Label>
              <Input id="novo-quantidade" type="number" min="0" value={campos.quantidade} onChange={(e) => setCampos({ ...campos, quantidade: e.target.value })} placeholder="0" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="novo-minimo">Estoque mínimo</Label>
              <Input id="novo-minimo" type="number" min="0" value={campos.estoqueMinimo} onChange={(e) => setCampos({ ...campos, estoqueMinimo: e.target.value })} placeholder="0" />
            </div>
          </div>
          {erro ? <p role="alert" className="text-sm text-destructive">{erro}</p> : null}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={fechar}>Cancelar</Button>
            <Button type="submit">Cadastrar material</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* Dialog: registrar entrada/saída ----------------------------------------- */
function MovimentacaoDialog({ materiais, onMovimentar }) {
  const inicial = { codigo: "", tipo: "entrada", quantidade: "" };
  const [open, setOpen] = useState(false);
  const [campos, setCampos] = useState(inicial);
  const [erro, setErro] = useState("");
  const material = materiais.find((m) => m.codigo === campos.codigo);

  function fechar() {
    setOpen(false);
    setCampos(inicial);
    setErro("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!material) {
      setErro("Selecione o material que terá o estoque movimentado.");
      return;
    }
    const quantidade = Number(campos.quantidade);
    if (campos.quantidade === "" || Number.isNaN(quantidade) || quantidade <= 0) {
      setErro("A quantidade deve ser maior que zero.");
      return;
    }
    if (campos.tipo === "saida" && quantidade > material.quantidade) {
      setErro(`Saldo insuficiente: ${material.material} tem apenas ${material.quantidade} ${material.unidade}.`);
      return;
    }
    onMovimentar({ codigo: material.codigo, tipo: campos.tipo, quantidade });
    fechar();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : fechar())}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowRightLeft className="h-4 w-4" />
          Registrar movimentação
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar movimentação</DialogTitle>
          <DialogDescription>Entradas aumentam o estoque, saídas diminuem. A situação é recalculada na hora.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="mov-material">Material</Label>
            <Select value={campos.codigo} onValueChange={(v) => setCampos({ ...campos, codigo: v })}>
              <SelectTrigger id="mov-material"><SelectValue placeholder="Selecione um material" /></SelectTrigger>
              <SelectContent>
                {materiais.map((m) => <SelectItem key={m.codigo} value={m.codigo}>{m.codigo} — {m.material}</SelectItem>)}
              </SelectContent>
            </Select>
            {material ? <p className="text-xs text-muted-foreground">Saldo atual: {material.quantidade} {material.unidade}</p> : null}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCampos({ ...campos, tipo: "entrada" })}
              className={`rounded-md border px-3 py-2.5 text-sm font-medium ${campos.tipo === "entrada" ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground"}`}
            >
              Entrada
            </button>
            <button
              type="button"
              onClick={() => setCampos({ ...campos, tipo: "saida" })}
              className={`rounded-md border px-3 py-2.5 text-sm font-medium ${campos.tipo === "saida" ? "border-copper bg-copper/10 text-copper" : "border-input text-muted-foreground"}`}
            >
              Saída
            </button>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="mov-quantidade">Quantidade</Label>
            <Input id="mov-quantidade" type="number" min="1" value={campos.quantidade} onChange={(e) => setCampos({ ...campos, quantidade: e.target.value })} placeholder="0" />
          </div>
          {erro ? <p role="alert" className="text-sm text-destructive">{erro}</p> : null}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={fechar}>Cancelar</Button>
            <Button type="submit">Confirmar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* Página da demonstração -------------------------------------------------- */
export default function DemoPage() {
  const [materiaisBase, setMateriaisBase] = useState(MATERIAIS_INICIAIS);
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState(TODAS);
  const [filtroSituacao, setFiltroSituacao] = useState(TODAS);
  const [feedback, setFeedback] = useState(null);

  // Base completa, com a situação SEMPRE recalculada. Cards e gráficos usam
  // esta lista inteira — os filtros afetam apenas a tabela.
  const materiais = useMemo(() => materiaisBase.map(comSituacaoRecalculada), [materiaisBase]);

  const materiaisFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return materiais.filter((m) => {
      const combinaBusca = termo === "" || m.material.toLowerCase().includes(termo) || m.codigo.toLowerCase().includes(termo);
      const combinaCategoria = filtroCategoria === TODAS || m.categoria === filtroCategoria;
      const combinaSituacao = filtroSituacao === TODAS || m.situacao === filtroSituacao;
      return combinaBusca && combinaCategoria && combinaSituacao;
    });
  }, [materiais, busca, filtroCategoria, filtroSituacao]);

  const totais = useMemo(() => ({
    total: materiais.length,
    normal: materiais.filter((m) => m.situacao === SITUACOES.NORMAL).length,
    baixo: materiais.filter((m) => m.situacao === SITUACOES.BAIXO).length,
    semEstoque: materiais.filter((m) => m.situacao === SITUACOES.SEM_ESTOQUE).length,
  }), [materiais]);

  const porCategoria = useMemo(
    () => CATEGORIAS.map((categoria) => ({ categoria, total: materiais.filter((m) => m.categoria === categoria).length })),
    [materiais]
  );

  const porSituacao = useMemo(
    () => Object.values(SITUACOES)
      .map((s) => ({ situacao: s, label: SITUACAO_LABEL[s], total: materiais.filter((m) => m.situacao === s).length, fill: CORES_SITUACAO[s] }))
      .filter((s) => s.total > 0),
    [materiais]
  );

  const filtrosAtivos = busca.trim() !== "" || filtroCategoria !== TODAS || filtroSituacao !== TODAS;

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 5000);
    return () => clearTimeout(timer);
  }, [feedback]);

  function handleCadastrar(novo) {
    setMateriaisBase((atual) => [...atual, novo]);
    setFeedback({ message: `${novo.material} cadastrado com sucesso.` });
  }

  function handleMovimentar({ codigo, tipo, quantidade }) {
    const material = materiaisBase.find((m) => m.codigo === codigo);
    setMateriaisBase((atual) =>
      atual.map((m) => (m.codigo === codigo ? { ...m, quantidade: tipo === "entrada" ? m.quantidade + quantidade : m.quantidade - quantidade } : m))
    );
    setFeedback({
      message: tipo === "entrada"
        ? `Entrada registrada: +${quantidade} ${material.unidade} em ${material.material}.`
        : `Saída registrada: -${quantidade} ${material.unidade} em ${material.material}.`,
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a home
          </Link>
        </div>
        <div className="border-t border-copper/25 bg-copper/[0.07]">
          <div className="container flex items-center gap-2 py-2.5 text-xs text-copper sm:text-sm">
            <Info className="h-4 w-4 shrink-0" />
            <p>Ambiente de demonstração — todos os materiais e movimentações são fictícios.</p>
          </div>
        </div>
        <div className="container flex flex-col gap-4 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Controle de matéria-prima</h1>
            <p className="mt-1 text-sm text-muted-foreground">Cadastre materiais, registre movimentações e acompanhe os indicadores.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <MovimentacaoDialog materiais={materiais} onMovimentar={handleMovimentar} />
            <CadastrarMaterialDialog codigosExistentes={materiais.map((m) => m.codigo)} onCadastrar={handleCadastrar} />
          </div>
        </div>
      </div>

      <div className="container flex flex-col gap-6 py-8">
        {feedback ? (
          <div role="status" className="flex items-start justify-between gap-3 rounded-lg border border-state-normal/30 bg-state-normal/5 px-4 py-3 text-sm text-state-normal">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{feedback.message}</p>
            </div>
            <button type="button" onClick={() => setFeedback(null)} aria-label="Fechar aviso" className="opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {/* Indicadores ---------------------------------------------------- */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Total de materiais", value: totais.total, icon: Boxes, tone: "text-ink" },
            { label: "Estoque normal", value: totais.normal, icon: CheckCircle2, tone: "text-state-normal" },
            { label: "Estoque baixo", value: totais.baixo, icon: AlertTriangle, tone: "text-state-low" },
            { label: "Sem estoque", value: totais.semEstoque, icon: XCircle, tone: "text-state-out" },
          ].map(({ label, value, icon: Icon, tone }) => (
            <Card key={label}>
              <CardContent className="flex items-center justify-between gap-3 p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className={`mt-1.5 font-display text-3xl font-semibold ${tone}`}>{value}</p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráficos (sempre com a base completa, independente dos filtros) - */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Materiais por categoria</CardTitle>
              <CardDescription>Quantidade de materiais cadastrados em cada grupo</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={porCategoria} margin={{ left: -16 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="categoria" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "hsl(var(--secondary))" }} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Bar dataKey="total" name="Materiais" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={56} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição do estoque</CardTitle>
              <CardDescription>Materiais normais, em estoque baixo e sem estoque</CardDescription>
            </CardHeader>
            <CardContent className="flex h-64 flex-col items-center sm:flex-row">
              <div className="h-44 w-full sm:h-full sm:flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                    <Pie data={porSituacao} dataKey="total" nameKey="label" innerRadius={54} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                      {porSituacao.map((entry) => <Cell key={entry.situacao} fill={entry.fill} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex shrink-0 flex-col gap-2 sm:pl-2">
                {porSituacao.map((item) => (
                  <li key={item.situacao} className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.fill }} />
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-ink">{item.total}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Busca e filtros --------------------------------------------------- */}
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="grid flex-1 gap-1.5 sm:min-w-[220px]">
            <Label htmlFor="busca-material">Buscar por nome ou código</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="busca-material" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Ex.: aço ou MP-001" className="pl-9" />
            </div>
          </div>
          <div className="grid gap-1.5 sm:w-48">
            <Label htmlFor="filtro-categoria">Categoria</Label>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger id="filtro-categoria"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={TODAS}>Todas as categorias</SelectItem>
                {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5 sm:w-48">
            <Label htmlFor="filtro-situacao">Situação</Label>
            <Select value={filtroSituacao} onValueChange={setFiltroSituacao}>
              <SelectTrigger id="filtro-situacao"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={TODAS}>Todas as situações</SelectItem>
                {Object.values(SITUACOES).map((s) => <SelectItem key={s} value={s}>{SITUACAO_LABEL[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" variant="ghost" disabled={!filtrosAtivos} onClick={() => { setBusca(""); setFiltroCategoria(TODAS); setFiltroSituacao(TODAS); }}>
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        </div>

        {/* Tabela ------------------------------------------------------------ */}
        {materiaisFiltrados.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
            <PackageOpen className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-display text-base font-medium text-ink">Nenhum material encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">Ajuste a busca ou os filtros para ver outros materiais.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Estoque mínimo</TableHead>
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materiaisFiltrados.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{item.codigo}</TableCell>
                    <TableCell className="font-medium text-ink">{item.material}</TableCell>
                    <TableCell className="text-muted-foreground">{item.categoria}</TableCell>
                    <TableCell className="text-muted-foreground">{item.unidade}</TableCell>
                    <TableCell className="text-right tabular-nums">{item.quantidade}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{item.estoqueMinimo}</TableCell>
                    <TableCell><SituacaoBadge situacao={item.situacao} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
}
