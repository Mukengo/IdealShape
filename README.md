# IdealShape — publicar 100% de graça

Dá para deixar tudo no ar sem pagar nada e sem cadastrar cartão em lugar
nenhum. São duas peças: a hospedagem e a IA do Coach.

---

## 1. Hospedagem: Vercel Hobby — R$ 0

O plano Hobby cobre com folga: endereço `.vercel.app` com HTTPS, deploy
automático a cada push, e funções serverless incluídas.

**A única pegadinha:** o Hobby é para projetos **não comerciais**. Enquanto o
app for gratuito, tudo certo. No dia em que você cobrar assinatura, precisa
migrar para o plano Pro. Cloudflare Pages e Netlify têm regras parecidas.

---

## 2. A IA do Coach: escolha um provedor gratuito

Números conferidos em setembro de 2026. **Eles mudam com frequência** — o
Google cortou as cotas em 50 a 80% em dezembro de 2025 sem aviso prévio.
Confira no site do provedor antes de decidir.

| Provedor | Cartão? | Limite grátis | Treina com seus dados? |
|---|---|---|---|
| **Groq** | não | ~30 msg/min · 1.000/dia | não |
| **Gemini** (AI Studio) | não | ~15 msg/min · 1.000/dia | **sim, no plano grátis** |
| **OpenRouter** | não | ~20 msg/min · **50/dia** | varia por modelo |
| Anthropic | sim | pago por uso | não |

### Recomendação: Groq

Três motivos. É o maior limite gratuito. Não pede cartão nem verificação por
telefone. E, principalmente, **não usa suas conversas para treinar modelos** —
o que pesa muito aqui, porque o Coach recebe peso, condições de saúde, lesões
e gestação no contexto.

O Gemini é excelente tecnicamente, mas o plano gratuito tem cláusula de uso dos
dados para melhorar os produtos do Google. Para um app de saúde, leia essa
cláusula antes de escolher. Habilitar billing remove a cláusula, mas aí o plano
gratuito deixa de existir.

O OpenRouter serve bem como reserva, mas **50 mensagens por dia** é pouco para
ser o principal.

---

## 3. Passo a passo

### 3.1 Pegue a chave do Groq

1. Entre em `console.groq.com` e faça login com Google ou GitHub.
2. Vá em **API Keys > Create API Key**.
3. Copie. Ela começa com `gsk_` e só aparece uma vez.

Não há cobrança, não há cartão, não há crédito que acabe. Só limites de uso.

### 3.2 Suba para o GitHub

```bash
cd idealshape
git init
git add .
git commit -m "IdealShape v1"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/idealshape.git
git push -u origin main
```

Confira com `git status` que nenhum `.env` foi junto.

### 3.3 Deploy na Vercel

1. `vercel.com`, login com GitHub, **Add New > Project**.
2. Escolha o repositório. Framework Preset: **Other**. Não mexa em mais nada.
3. Abra **Environment Variables** e adicione:

   | Name | Value |
   |---|---|
   | `GROQ_API_KEY` | sua chave `gsk_...` |

   Marque Production, Preview e Development.
4. **Deploy.** Cerca de um minuto.

### 3.4 Teste

Abra o site, faça o onboarding, registre um treino e **mande uma mensagem no
Coach**. Se responder, está tudo de pé.

---

## 4. A fila de reserva

A função aceita mais de uma chave ao mesmo tempo e tenta na ordem
**Groq → Gemini → OpenRouter → Anthropic**, pulando para o próximo quando um
estoura a cota. Configurar Groq e Gemini juntos dá cerca de 2.000 mensagens
por dia sem pagar nada.

```
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIza...
```

Variáveis opcionais:

| Variável | Para quê |
|---|---|
| `PROVEDOR` | força um só (`groq`, `gemini`, `openrouter`, `anthropic`) |
| `MODELO` | troca o modelo padrão; **nomes de modelo mudam com o tempo** |

Se o Coach começar a falhar sem motivo aparente, a primeira suspeita é o nome
do modelo ter saído do ar. Veja os logs em **Vercel > Deployments > Functions**
e ajuste o `MODELO`.

---

## 5. Cada usuário com a própria chave

Foi adicionado um cartão em **Você > Chave de IA própria**. A pessoa cola a
chave gratuita dela, escolhe o provedor, e passa a usar a cota dela.

Isso resolve o problema de escala: as cotas gratuitas são por conta, então cem
usuários com chave própria custam a você exatamente zero, para sempre.

A chave fica no `localStorage` do aparelho dela, vai ao seu servidor apenas
para aquela resposta e não é guardada. Quem usa chave própria também não entra
no limite de 12 mensagens por minuto por IP.

O app avisa, na própria tela, quando o provedor escolhido treina com os dados
enviados.

---

## 6. Sobre a qualidade das respostas

Os modelos gratuitos são bons, mas não são o Claude. Você vai notar diferença
em conversas longas e em raciocínio mais fino sobre periodização.

O que **não** muda: todas as regras de segurança ficam no prompt do servidor e
valem para qualquer provedor. E as guardas que mais protegem — sem déficit para
menor de idade, gestante ou IMC baixo, e os alertas de exercício por lesão — são
código no app, não dependem da IA.

Se um dia quiser o Claude de volta, basta adicionar `ANTHROPIC_API_KEY` e a fila
passa a usá-lo como último recurso, ou defina `PROVEDOR=anthropic`.

---

## 7. Custo total

| Item | Custo |
|---|---|
| Hospedagem Vercel Hobby | R$ 0 |
| Endereço `.vercel.app` | R$ 0 |
| HTTPS | R$ 0 |
| IA do Coach (Groq) | R$ 0 |
| **Total** | **R$ 0** |

Opcional: domínio `.com.br` no `registro.br`, cerca de R$ 40 por ano.

---

## 8. Se algo der errado

| Sintoma | Causa provável |
|---|---|
| "Nenhuma chave de IA configurada" | variável não salva, ou deploy não refeito depois de salvar |
| "Todos os provedores atingiram a cota" | cota diária esgotada; espere a virada em UTC ou configure outro provedor |
| Coach falha sempre e o log mostra 404 do modelo | nome do modelo mudou; ajuste `MODELO` |
| "Sua chave foi recusada" | chave incompleta, ou provedor errado selecionado em Você |
| Não aparece opção de instalar | confira se `/manifest.json` retorna 200 na aba Network |

---

## 9. Arquivos

```
index.html            o app
api/coach.js          funcao serverless: guarda as chaves e o prompt
manifest.json         torna o site instalavel na tela de inicio
vercel.json           cabecalhos de seguranca e cache
package.json          declara Node 18+ e modulos ES
icons/                icones gerados a partir da sua logo
.env.example          modelo das variaveis de ambiente
.gitignore            impede subir .env por acidente
```

**Por que o prompt vive no servidor:** se ele estivesse no HTML, qualquer pessoa
abriria o devtools e o editaria para apagar as regras de gestação, de menor de
idade ou de substâncias antes de enviar a mensagem. No servidor, isso é
impossível.
