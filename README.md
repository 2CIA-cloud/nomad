# AZIMUTE | Navegação e Informação

Plataforma Progressive Web App (PWA) de navegação, orientação territorial e consulta rápida de informações para apoio à atividade policial.

---

## 1. Estrutura dos Arquivos PWA

Todos os caminhos foram configurados de forma relativa (`./`) para funcionar tanto na raiz de um domínio quanto em subpastas de hospedagem estática:

```text
/
├── index.html                  # Aplicação principal (SPA/PWA) com metadados Open Graph, Twitter Card e ícones
├── manifest.webmanifest        # Manifesto oficial da PWA (nome, tema #0D0D0D, escopo ./ e ícones)
├── manifest.json               # Manifesto espelho de retrocompatibilidade
├── sw.js                       # Service Worker para funcionamento offline e cache de ativos
├── dados.json                  # Base de dados territorial e operacional local
├── favicon.ico                 # Ícone clássico multi-resolução (16x16 e 32x32)
├── favicon-16x16.png           # Favicon 16x16 px
├── favicon-32x32.png           # Favicon 32x32 px
├── apple-touch-icon.png        # Ícone para tela inicial iOS (180x180 px)
├── icon-192x192.png            # Ícone padrão Android / PWA (192x192 px)
├── icon-512x512.png            # Ícone de alta resolução PWA / Splash Screen (512x512 px)
├── icon-maskable-512x512.png   # Ícone adaptável Android com margem segura de ~15% (512x512 px)
├── og-image.png                # Imagem de pré-visualização social (1200x630 px)
├── icons/                      # Cópia organizada dos ícones em subpasta dedicada
└── README.md                   # Esta documentação técnica
```

---

## 2. Como Publicar no Netlify ou Hospedagem Estática (HTTPS)

Os recursos de **PWA (Service Worker, instalação na tela inicial e Geolocalização GPS)** exigem obrigatoriamente conexão segura **HTTPS**.

### Publicação rápida no Netlify (Arrastar e Soltar):
1. Extraia o conteúdo deste pacote `.zip` em uma pasta local no computador.
2. Acesse [app.netlify.com](https://app.netlify.com/) e faça login.
3. Na aba **Sites**, arraste a pasta extraída diretamente para a área **"Drag and drop your site output folder here"**.
4. O Netlify publicará o projeto instantaneamente com certificado **HTTPS gratuito** e URL pública ativa.

*(Alternativamente, você pode enviar todos os arquivos extraídos para um repositório no GitHub e ativar o **GitHub Pages** ou conectar o repositório ao Netlify/Vercel.)*

---

## 3. Pré-visualização no WhatsApp e Telegram (`og-image.png`)

Para que os robôs (*crawlers*) do **WhatsApp**, **Telegram** e outras plataformas exibam o cartão com o símbolo oficial (`og-image.png`, 1200×630 px) ao compartilhar o link:

1. **URL Pública HTTPS Obrigatória:** O aplicativo precisa estar hospedado em um endereço público acessível na internet via `https://` (links locais como `localhost`, `file://` ou IPs internos não são lidos pelos servidores do WhatsApp/Telegram).
2. **Disponibilidade Direta da Imagem:** Após publicar, teste abrir `https://seu-dominio.netlify.app/og-image.png` no navegador para confirmar que a imagem carrega sem redirecionamento de login.
3. **Atualização de Cache de Link:** Caso compartilhe um link antigo que ainda exiba prévia desatualizada no Telegram, utilize o bot oficial `@WebpageBot` no Telegram para forçar a atualização do cache da URL.

---

## 4. Como Validar e Instalar como Aplicativo no Android

1. Abra a URL pública HTTPS do **AZIMUTE** no **Google Chrome** no dispositivo Android.
2. **Instalação:** Toque no menu **`⋮`** (canto superior direito) e selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
3. **Validação Visual:** Verifique na tela inicial e na gaveta de aplicativos do Android se o ícone dourado sobre fundo preto `#0D0D0D` aparece centralizado e sem cortes nas pontas **N, S, L, O** (garantido pelo `icon-maskable-512x512.png`).
4. **Modo Standalone e Offline:** Abra o aplicativo pelo ícone instalado — ele abrirá em tela dedicada sem barra de endereço (`"display": "standalone"`) e manterá o carregamento local via `sw.js`.
5. **Inspeção Técnica (Opcional):** Pelo computador com Chrome DevTools (`F12` -> aba **Application** -> **Manifest** e **Service Workers**), confirme que não há avisos de manifesto ou ícones ausentes.
