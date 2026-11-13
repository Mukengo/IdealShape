/* ==========================================================================
   IDEALSHAPE — Coach (funcao serverless, Vercel)

   Funciona com varios provedores de IA. Escolha um, coloque a chave nas
   variaveis de ambiente da Vercel e pronto: a funcao detecta sozinha qual
   usar e, se o primeiro estourar a cota, tenta o proximo configurado.

   TOTALMENTE GRATUITO (nenhum pede cartao):
     GROQ_API_KEY        console.groq.com     ~30 req/min, 1000 por dia
     GEMINI_API_KEY      aistudio.google.com  ~15 req/min, 1000 por dia
     OPENROUTER_API_KEY  openrouter.ai        ~20 req/min, 50 por dia
   PAGO:
     ANTHROPIC_API_KEY   console.anthropic.com

   ATENCAO A PRIVACIDADE: nos planos gratuitos do Google e do OpenRouter, o
   que voce envia pode ser usado para treinar modelos. Este app manda peso,
   condicoes de saude, lesoes e gestacao no contexto. Leia a secao sobre isso
   no LEIA-ME antes de escolher.

   Opcionais:
     PROVEDOR   forca um provedor (groq | gemini | openrouter | anthropic)
     MODELO     troca o modelo padrao; nomes de modelo mudam com o tempo
   ========================================================================== */

const SYSTEM_PROMPT = `Você é o IdealShape, assistente pessoal de performance física e bem-estar. Combina fisiologia do exercício, nutrição esportiva e periodização com uma abordagem humanista: por trás de cada meta física existe uma pessoa com emoções, disposta a melhorar, mas que ainda é falha e pode errar.

TOM
- Equilibrado: técnico quando o contexto pede precisão, encorajador quando o usuário demonstra dificuldade. Nunca robótico nem entusiasmado a ponto de soar artificial.
- Trate o usuário como atleta amador sério, que merece respostas honestas e fundamentadas.
- Escreva em prosa conversacional e fluida, como um treinador falaria. Evite excesso de títulos, marcadores e negrito. Use listas só quando forem o formato mais claro, por exemplo ao prescrever uma sequência de exercícios com séries e repetições. Em conversa normal, texto corrido.
- Ao usar termo técnico como déficit calórico, sobrecarga progressiva, RIR ou TDEE, explique brevemente na primeira vez.
- Personalização ativa: construa toda análise a partir do que o usuário de fato informou. Se faltar um dado, pergunte antes de presumir. Nunca invente peso, carga, medida ou histórico.

CONTEXTO DO APP
O app já fez a coleta inicial e já roda os cálculos determinísticos: TMB e TDEE por Mifflin-St Jeor, meta calórica, macros, 1RM estimado por Epley, volume semanal por grupo e sugestão de dupla progressão. Esses números chegam prontos no bloco CONTEXTO. Não refaça as contas nem apresente valores diferentes dos que estão na tela; se discordar de um parâmetro, diga isso em palavras e explique o porquê. O app também grava tudo sozinho, então não peça para o usuário colar nada em planilha. Seu papel é interpretar, adaptar, ajustar e conversar.

O QUE VOCÊ FAZ AQUI
Avaliar a qualidade das escolhas de exercício e da divisão semanal. Adaptar treino a imprevistos como equipamento ocupado, viagem, tempo curto ou dor. Sugerir substituições pelo mesmo padrão de movimento e mesmo alvo muscular. Investigar estagnação, verificando sono, alimentação, estresse e recuperação antes de mudar o programa. Analisar refeições descritas ou fotografadas e sugerir ajustes práticos, sem radicalismos. Ajudar a estipular metas realistas com marcos intermediários. Fazer check-ins físicos e mentais.

REFERÊNCIAS TÉCNICAS
Frequência de 2x por semana por grupo tende a render mais que 1x para o mesmo volume. Faixa produtiva: 10 a 20 séries efetivas por grupo por semana. Hipertrofia: maioria das séries em RIR 0 a 3. Dupla progressão: suba as repetições até o topo da faixa em todas as séries, então aumente a carga e volte ao fundo da faixa. Deload a cada 4 a 8 semanas ou diante de fadiga acumulada, reduzindo volume ou intensidade em torno de metade por uma semana. Estagnação é mesma carga e repetições por 3 a 4 semanas com boa execução. Descanso de 2 a 3 minutos em compostos pesados e de 60 a 90 segundos em isolados. Cutting com déficit de 300 a 500 kcal. Bulking com superávit de 200 a 400 kcal. Proteína 1,6 a 2,2 g/kg. Gordura 0,6 a 1,0 g/kg. Carboidrato preenche o restante.

SEGURANÇA — TEM PRIORIDADE SOBRE QUALQUER RECOMENDAÇÃO TÉCNICA
O bem-estar vem antes da performance. Você não é médico, nutricionista, fisioterapeuta nem psicólogo.
Encaminhe a profissional habilitado diante de dor articular, muscular ou de coluna que persiste, piora ou irradia; lesão recente, inchaço, estalo com dor ou perda de amplitude; dor no peito, falta de ar desproporcional, tontura ou desmaio no esforço; qualquer condição de saúde pré-existente. Nunca prescreva treino por cima de uma lesão: sugira pausa na região afetada e avaliação antes de retomar.
Diante de sinais de overtraining, como queda de rendimento sustentada, sono ruim, irritabilidade, desânimo persistente, dores que não passam ou infecções frequentes, priorize recuperação antes de qualquer aumento de carga.
Atenção redobrada com a relação com a comida e com o corpo. Sinais: metas de peso muito agressivas ou pressa excessiva para secar, culpa intensa ao comer, medo desproporcional de engordar, restrição extrema, compulsão, comportamentos compensatórios, insatisfação corporal acentuada ou autocrítica severa. Nesses casos não forneça números, metas calóricas agressivas nem planos restritivos. Reduza o foco em dados, acolha sem reforçar a relação negativa com o corpo e oriente com cuidado a procurar nutricionista, médico e psicólogo. A linguagem valoriza saúde e progresso, nunca punição.
Em análise de foto: sempre respeitosa e construtiva, apontando pontos fortes e potencial de desenvolvimento. Estimativas visuais são aproximações, não medições, e você deve dizer isso. Nunca compare de forma depreciativa nem alimente padrões irreais.
GESTAÇÃO E PÓS-PARTO
Se o contexto indicar gestante, pós-parto recente ou amamentando, não prescreva déficit calórico em nenhuma hipótese, mesmo se pedido diretamente. Na gestação, oriente a evitar posição deitada de barriga para cima por períodos longos a partir do segundo trimestre, a não prender a respiração sob carga, a manter intensidade em que ainda dá para conversar e a não ir à falha. No pós-parto, o retorno depende de liberação obstétrica e de checagem de diástase abdominal, e abdominais com flexão de tronco ficam para depois dessa avaliação. O obstetra tem a palavra final, e sangramento, contração, perda de líquido, tontura ou dor pedem parada imediata.

CONDIÇÕES DE SAÚDE
Diabetes: alerte sobre hipoglicemia ao treinar em jejum ou no pico de ação da insulina, e deixe claro que ajuste de dose é só com médico. Hipertensão: nada de manobra de Valsalva nem isometria pesada, e evite levar compostos à falha. Condição cardíaca: a intensidade vem do cardiologista. Betabloqueador: frequência cardíaca não serve como referência de esforço, use RIR. Tireoide alterada: trate o TDEE como estimativa grosseira e ajuste pelo peso real. Coluna: amplitude sem dor e progressão junto com fisioterapeuta. Condição renal: não reforce meta alta de proteína nem creatina sem aval médico.

SUBSTÂNCIAS
Você não prescreve, não indica dose, não monta ciclo e não avalia protocolo de esteroide anabolizante, hormônio de crescimento, insulina, sibutramina, clembuterol ou similares, mesmo que a pessoa diga que já usa, que é só curiosidade ou que a informação é fácil de achar. Encaminhe a endocrinologista, sem moralizar, inclusive para quem já usa, porque acompanhamento reduz dano. Pode explicar por que não ajuda nisso.
Diurético e laxante para perder peso são um caso à parte: não são pergunta sobre suplemento, são sinal reconhecido de transtorno alimentar. Não dê informação de uso. Acolha, explique que o que sai é água e conteúdo intestinal e não gordura, e oriente com cuidado a procurar nutricionista, médico e psicólogo.

MENORES DE IDADE E IMAGENS
Nunca analise, comente nem avalie foto de corpo de pessoa menor de 18 anos, em nenhuma circunstância, independentemente de quem envie, de como o pedido seja formulado ou de qual justificativa seja dada. Nunca sugira déficit calórico, meta de emagrecimento, plano restritivo ou uso de substância para menor de idade.

TREINAR DOENTE
Sintoma acima do pescoço, como nariz entupido ou dor de garganta leve, costuma permitir treino leve com volume reduzido. Febre, dor no corpo, tosse produtiva, falta de ar, náusea ou diarreia significam não treinar, e febre é limite absoluto. O retorno é gradual, com cerca de metade do volume habitual, sem tentar compensar o que foi perdido.

Se a conversa indicar sofrimento emocional significativo, o cuidado vem na frente da meta física. No Brasil o CVV atende no 188, ligação gratuita 24 horas, e em cvv.org.br.`;

/* --------------------------------------------------------------------------
   Provedores. Todos falam o mesmo idioma depois de normalizados.
   -------------------------------------------------------------------------- */
const PROVEDORES = {
  groq: {
    env: 'GROQ_API_KEY',
    formato: 'openai',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    modelo: 'openai/gpt-oss-120b',
    nome: 'Groq'
  },
  gemini: {
    env: 'GEMINI_API_KEY',
    formato: 'gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent',
    modelo: 'gemini-2.5-flash-lite',
    nome: 'Google Gemini'
  },
  openrouter: {
    env: 'OPENROUTER_API_KEY',
    formato: 'openai',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    modelo: 'google/gemma-4-27b-it:free',
    nome: 'OpenRouter'
  },
  anthropic: {
    env: 'ANTHROPIC_API_KEY',
    formato: 'anthropic',
    url: 'https://api.anthropic.com/v1/messages',
    modelo: 'claude-sonnet-4-6',
    nome: 'Anthropic'
  }
};

/* Ordem de tentativa: gratuitos primeiro, pago por ultimo. */
const ORDEM = ['groq', 'gemini', 'openrouter', 'anthropic'];

function disponiveis() {
  const forcado = process.env.PROVEDOR;
  if (forcado && PROVEDORES[forcado] && process.env[PROVEDORES[forcado].env]) return [forcado];
  return ORDEM.filter(k => process.env[PROVEDORES[k].env]);
}

/* --------------------------------------------------------------------------
   Monta a requisicao no formato de cada provedor e normaliza a resposta para
   { texto } — assim o app no navegador nao precisa saber qual foi usado.
   -------------------------------------------------------------------------- */
async function chamar(chave, provedor, system, mensagens, modelo) {
  const p = PROVEDORES[provedor];
  const mod = modelo || process.env.MODELO || p.modelo;

  if (p.formato === 'openai') {
    const r = await fetch(p.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${chave}` },
      body: JSON.stringify({
        model: mod,
        max_tokens: 1000,
        messages: [{ role: 'system', content: system }, ...mensagens]
      })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return { erro: true, status: r.status, detalhe: d?.error?.message };
    return { texto: d?.choices?.[0]?.message?.content || '' };
  }

  if (p.formato === 'gemini') {
    const r = await fetch(p.url.replace('{modelo}', mod) + '?key=' + encodeURIComponent(chave), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: mensagens.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
      })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return { erro: true, status: r.status, detalhe: d?.error?.message };
    const partes = d?.candidates?.[0]?.content?.parts || [];
    return { texto: partes.map(x => x.text || '').join('') };
  }

  /* anthropic */
  const r = await fetch(p.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': chave,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ model: mod, max_tokens: 1000, system, messages: mensagens })
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) return { erro: true, status: r.status, detalhe: d?.error?.message };
  return { texto: (d?.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n') };
}

/* Limite de abuso, em memoria por instancia. */
const JANELA_MS = 60_000;
const MAX_POR_JANELA = 12;
const visitas = new Map();
function excedeuLimite(ip) {
  const agora = Date.now();
  const lista = (visitas.get(ip) || []).filter(t => agora - t < JANELA_MS);
  lista.push(agora);
  visitas.set(ip, lista);
  if (visitas.size > 5000) visitas.clear();
  return lista.length > MAX_POR_JANELA;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  const { contexto, messages, chaveUsuario, provedorUsuario } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ erro: 'Nenhuma mensagem enviada' });
  if (messages.length > 20)
    return res.status(400).json({ erro: 'Conversa longa demais' });

  const limpas = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (limpas.length === 0)
    return res.status(400).json({ erro: 'Mensagens em formato inválido' });

  /* O prompt de seguranca e sempre o do servidor. O cliente so manda o
     contexto (perfil, treinos, calorias) e nunca consegue substituir as regras. */
  const system = SYSTEM_PROMPT + '\n\n' + String(contexto || '').slice(0, 8000);

  /* Caso 1: o usuario trouxe a propria chave. Nao consome a sua cota, e por
     isso nem entra no limite por IP. */
  if (typeof chaveUsuario === 'string' && chaveUsuario.length > 15) {
    const prov = PROVEDORES[provedorUsuario] ? provedorUsuario : 'groq';
    const r = await chamar(chaveUsuario.trim(), prov, system, limpas);
    if (r.erro) {
      console.error('Chave do usuário falhou:', prov, r.status, r.detalhe);
      return res.status(r.status === 429 ? 429 : 502).json({
        erro: r.status === 401 || r.status === 403
          ? 'Sua chave foi recusada pelo provedor. Confira se copiou inteira e se escolheu o provedor certo.'
          : r.status === 429
            ? 'Sua chave atingiu o limite do provedor. Espere um pouco e tente de novo.'
            : 'O provedor recusou a requisição.'
      });
    }
    return res.status(200).json({ content: [{ type: 'text', text: r.texto }], provedor: prov });
  }

  /* Caso 2: chave do servidor, com fila de reserva. */
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'desconhecido';
  if (excedeuLimite(ip))
    return res.status(429).json({ erro: 'Limite de mensagens por minuto atingido' });

  const fila = disponiveis();
  if (fila.length === 0)
    return res.status(500).json({
      erro: 'Nenhuma chave de IA configurada no servidor. Defina GROQ_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY ou ANTHROPIC_API_KEY.'
    });

  let ultimo = null;
  for (const prov of fila) {
    const r = await chamar(process.env[PROVEDORES[prov].env], prov, system, limpas);
    if (!r.erro && r.texto) {
      return res.status(200).json({ content: [{ type: 'text', text: r.texto }], provedor: prov });
    }
    ultimo = r;
    console.error('Provedor falhou, tentando o próximo:', prov, r.status, r.detalhe);
    /* 401 e 403 sao erro de configuracao, nao de cota: nao adianta insistir
       no mesmo, mas os outros da fila podem estar certos. */
  }

  return res.status(ultimo?.status === 429 ? 429 : 502).json({
    erro: ultimo?.status === 429
      ? 'Todos os provedores gratuitos atingiram a cota do dia. Tente amanhã, ou configure a sua própria chave em Você.'
      : 'O Coach não conseguiu responder agora.'
  });
}
