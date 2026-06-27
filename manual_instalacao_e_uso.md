# Manual Completo de Instalação e Utilização
## Plataforma Arque Gestão (E-TODAVIA)

Este manual contém as instruções passo a passo para a instalação da aplicação **Arque Gestão** na Hostinger (tanto no serviço **Cloud** quanto em uma **VPS**), além de um guia completo de utilização do painel administrativo para os diferentes níveis de governança: **Super Admin**, **Admin** e **Editor**.

---

## 🚀 Parte 1: Guia de Instalação (Hostinger Cloud vs. VPS)

A aplicação é construída sobre **Node.js (Express)** e utiliza um banco de dados **MySQL**. Abaixo estão as duas formas de implantação na Hostinger.

---

### Opção A: Instalação no Hostinger Cloud (Hospedagem de Sites com Suporte Node.js)

A Hostinger oferece suporte nativo a aplicações Node.js em seus planos Cloud através do painel hPanel.

#### Passo 1: Preparar os Arquivos e Enviar
1. Compacte todos os arquivos do projeto em um arquivo `.zip` (exclua a pasta `node_modules` e o arquivo `.env` local).
2. Acesse o **hPanel** da Hostinger, vá em **Sites** > **Gerenciar** no seu domínio.
3. No menu lateral esquerdo, busque por **Gerenciador de Arquivos**.
4. Faça o upload do arquivo `.zip` para a raiz pública do seu site e descompacte os arquivos.

#### Passo 2: Criar o Banco de Dados MySQL
1. No painel do seu site, vá em **Bancos de Dados** > **Bancos de Dados MySQL**.
2. Crie um novo banco de dados:
   * **Nome do banco de dados:** ex: `u123456789_arque`
   * **Usuário do MySQL:** ex: `u123456789_user`
   * **Senha:** Defina uma senha forte.
3. Anote estas informações (Host do Banco normalmente é `localhost` ou o IP fornecido pela Hostinger).

#### Passo 3: Configurar as Variáveis de Ambiente (`.env`)
1. No Gerenciador de Arquivos, renomeie o arquivo `.env.example` para `.env` (ou crie um novo arquivo `.env`).
2. Edite as variáveis conforme as credenciais criadas:
   ```env
   PORT=3000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=u123456789_user
   DB_PASS=SuaSenhaForteAqui
   DB_NAME=u123456789_arque
   JWT_SECRET=UmaChaveSecretaUunicaEAltamenteSegura
   WHATSAPP_DEFAULT=5511999999999
   ```

#### Passo 4: Configurar e Iniciar a Aplicação Node.js no hPanel

1. **Acessar a Seção Node.js:** 
   * No menu lateral do **hPanel**, navegue até **Avançado** > **Node.js**.
   
2. **Criar a Configuração da Aplicação:**
   * Clique em **Criar aplicação** (ou edite a existente) e preencha os campos obrigatórios:
     * **Versão do Node.js:** Selecione a versão recomendada (ex: `v18` ou `v20`).
     * **Diretório da aplicação:** Selecione a pasta onde os arquivos foram descompactados (geralmente `/` ou `/public_html`).
     * **Domínio da aplicação:** Selecione o domínio ou subdomínio onde o site ficará visível.
     * **Arquivo de inicialização (Startup File):** Defina como `server.js`.
   * Clique no botão **Salvar** para registrar as configurações.

3. **Instalar Dependências (npm install):**
   * Ainda na tela de gerenciamento do Node.js, clique no botão **Instalar dependências** (ou **npm install**). A Hostinger lerá o arquivo `package.json` e instalará todas as dependências automaticamente.

4. **Executar a Inicialização do Banco de Dados (Criar tabelas e Super Admin):**
   Como esta etapa exige rodar scripts em linha de comando, você tem duas opções no **hPanel**:
   
   * **Opção 1 (Via Terminal SSH - Recomendada):**
     1. No menu lateral do hPanel, vá em **Avançado** > **Acesso SSH**.
     2. Ative o acesso SSH caso esteja desativado e copie as credenciais de login.
     3. Conecte-se usando o terminal do seu computador (ou o terminal web integrado da Hostinger).
     4. Navegue até a pasta do site (ex: `cd domains/seu_dominio.com/public_html`) e execute:
        ```bash
        node setup-db.js
        node setup-superadmin.js
        ```
   * **Opção 2 (Temporária pelo Painel):**
     1. Na página do **Node.js**, altere temporariamente o campo **Arquivo de inicialização** para `setup-db.js` e clique em **Salvar**.
     2. Clique em **Iniciar aplicação** para rodar o script de criação das tabelas. Em seguida, clique em **Parar**.
     3. Repita o processo alterando o **Arquivo de inicialização** para `setup-superadmin.js` e clique em **Iniciar aplicação** (isso criará o usuário admin). Clique em **Parar**.
     4. Restaure o **Arquivo de inicialização** de volta para `server.js` e clique em **Salvar**.

5. **Iniciar a Aplicação:**
   * Com tudo configurado e o banco inicializado, basta ir até a aba **Node.js** e clicar no botão **Iniciar aplicação** (ou **Start**). O status mudará para *Executando*.

---

### Opção B: Instalação em Hostinger VPS (Servidor Ubuntu Dedicado) - *Recomendado para Máxima Performance*

Este método utiliza um servidor Ubuntu limpo na VPS da Hostinger. Ele oferece controle total, maior segurança e desempenho superior utilizando **PM2** e **Nginx**.

#### Passo 1: Acessar a VPS via SSH
Abra o terminal do seu computador (PowerShell no Windows, Terminal no Mac/Linux) e conecte-se à VPS:
```bash
ssh root@IP_DA_SUA_VPS
```
*(Digite a senha cadastrada no painel da VPS da Hostinger).*

#### Passo 2: Atualizar o Servidor e Instalar Dependências
Execute os comandos para instalar Node.js, MySQL, Git e Nginx:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx build-essential

# Instalar Node.js (Versão 20.x LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Passo 3: Configurar o Banco de Dados MySQL
1. Acesse o terminal do MySQL:
   ```bash
   sudo mysql
   ```
2. Crie o banco de dados, o usuário e conceda as permissões:
   ```sql
   CREATE DATABASE logistica01 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'arque_user'@'localhost' IDENTIFIED BY 'SUA_SENHA_ULTRA_SEGURA';
   GRANT ALL PRIVILEGES ON logistica01.* TO 'arque_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

#### Passo 4: Clonar ou Enviar o Projeto
Crie uma pasta para a aplicação em `/var/www/` e envie/clone seu repositório:
```bash
sudo mkdir -p /var/www/arque-gestao
sudo chown -R $USER:$USER /var/www/arque-gestao
cd /var/www/arque-gestao

# Clone seu repositório ou envie via SFTP (FileZilla) para esta pasta.
```

#### Passo 5: Configurar Variáveis de Ambiente e Instalar Dependências
1. Instale os pacotes npm:
   ```bash
   npm install --production
   ```
2. Crie e edite o arquivo `.env`:
   ```bash
   nano .env
   ```
   Cole e configure as variáveis de ambiente:
   ```env
   PORT=3000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=arque_user
   DB_PASS=SUA_SENHA_ULTRA_SEGURA
   DB_NAME=logistica01
   JWT_SECRET=ChaveSuperSecretaTokenJWT
   WHATSAPP_DEFAULT=5511999999999
   ```
   *(Pressione `Ctrl + O` e depois `Enter` para salvar, e `Ctrl + X` para sair do editor nano).*

#### Passo 6: Executar Scripts de Inicialização do Banco
Execute os utilitários de banco do projeto para criar a estrutura e o primeiro Super Admin:
```bash
node setup-db.js
node setup-superadmin.js
```
*Isto irá provisionar o banco de dados e criar o acesso padrão do Super Admin:*
* **E-mail:** `superadmin@site.com`
* **Senha:** `ET.2026*`

#### Passo 7: Configurar o Gerenciador de Processos (PM2)
O PM2 garante que sua aplicação continue rodando em segundo plano e reinicie sozinha caso ocorra alguma falha ou reinicialização da VPS.
```bash
# Instalar PM2 globalmente
sudo npm install -y -g pm2

# Iniciar o servidor
pm2 start server.js --name "arque-gestao"

# Configurar inicialização automática junto com o sistema operacional
pm2 startup
# (Execute o comando que o PM2 exibir na tela para finalizar a configuração de inicialização automática)

# Salvar lista de processos atual
pm2 save
```

#### Passo 8: Configurar o Nginx como Proxy Reverso
1. Remova a configuração padrão:
   ```bash
   sudo rm /etc/nginx/sites-enabled/default
   ```
2. Crie uma nova configuração:
   ```bash
   sudo nano /etc/nginx/sites-available/arque-gestao
   ```
3. Cole a configuração de proxy (substitua `seu_dominio.com` pelo seu domínio real):
   ```nginx
   server {
       listen 80;
       server_name seu_dominio.com www.seu_dominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```
4. Ative o site e teste o Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/arque-gestao /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### Passo 9: Configurar SSL Grátis (HTTPS) com Let's Encrypt
```bash
sudo apt install snapd
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d seu_dominio.com -d www.seu_dominio.com
```
*(Siga as instruções na tela e confirme a renovação automática).*

---

## 🛠️ Parte 2: Manual Detalhado de Utilização do Painel

O painel administrativo possui **três níveis de governança**. O controle de acesso é aplicado de forma robusta tanto visualmente (menus ocultados no sidebar) quanto em nível de rotas no servidor (Express middleware).

---

### 🛡️ Nível 1: SUPER ADMIN (Acesso Total e Governança)

O Super Admin possui controle total sobre a plataforma. É o único que pode visualizar as configurações sensíveis e gerenciar quem opera a aplicação.

#### Acesso Padrão Inicial:
* **URL:** `https://seu_dominio.com/admin/login`
* **Usuário:** `superadmin@site.com`
* **Senha Provisória:** `ET.2026*`

#### 🌟 Funcionalidades Exclusivas do Super Admin:

1. **Gestão de Usuários (Controle de Governança):**
   * Localizado no menu lateral esquerdo em **"Gestão de Usuários"** (`/admin/usuarios`).
   * Permite **Criar, Editar, Desativar ou Excluir** contas de acesso de Administradores (`admin`) e Editores (`editor`).
   * Ao criar ou editar um usuário de nível **Admin**, o Super Admin define permissões granulares de visualização e edição, ativando módulos específicos como:
     * Dashboard Operacional
     * Moderação de Depoimentos
     * Especialidades & Serviços
     * Configurações Gerais
     * Editor Global (CMS) - com abas de controle individuais
   * *Atenção:* O Super Admin não pode excluir a si mesmo para evitar bloqueios permanentes do sistema.

2. **Licenciamento (Elite):**
   * Aba crítica e protegida no topo do menu lateral: **"Licenciamento (Elite)"** (`/admin/conteudo?tab=tab-licenciamento`).
   * Permite gerenciar a chave de ativação da plataforma e visualizar os logs de integridade.

3. **Visibilidade Sem Bloqueio:**
   * O Super Admin ignora qualquer restrição de permissão do CMS. Ele possui acesso de leitura e escrita nativo a todas as abas e botões do sistema.

---

### 👤 Nível 2: ADMIN (Administrador Geral Customizável)

O nível de Administrador é projetado para gerentes, parceiros ou donos do negócio. A flexibilidade deste nível reside no **Controle de Acesso Baseado em Módulos** atribuído pelo Super Admin.

#### ⚙️ Funcionalidades Disponíveis (Se Concedidas pelo Super Admin):

1. **Dashboard Operacional:**
   * Acesso aos gráficos de desempenho, métricas de visitas da Landing Page e o totalizador de leads capturados.

2. **Serviços & Especialidades:**
   * Permite gerenciar a seção de serviços da empresa.
   * Ações: **Adicionar Novo Serviço**, **Editar Descrições/Valores/Ícones** e **Remover Serviços** obsoletos.

3. **Moderação de Depoimentos:**
   * Permite cadastrar novos depoimentos manuais de clientes satisfeitos (Nome, Cargo, Imagem do cliente e Descrição da Avaliação).
   * **Integração com Google Business Profile:** Se as chaves API do Google estiverem no `.env`, o Admin poderá clicar no botão **"Sincronizar Google"** para importar avaliações reais automaticamente.

4. **Configurações Gerais:**
   * Permite alterar dados institucionais como: Nome da Empresa, E-mail de Atendimento, Telefone, links de Redes Sociais e Cores de Identidade Visual.

5. **Editor Global (CMS):**
   * O Admin tem acesso às abas de conteúdo pré-autorizadas para edição direta dos textos, cabeçalhos, rodapés e construtor de layout.

*🚫 **O que o Admin NÃO pode fazer:** O Admin não tem acesso à tela de "Gestão de Usuários" e não pode criar ou editar outros acessos, além de não possuir a aba de "Licenciamento (Elite)".*

---

### 📝 Nível 3: EDITOR (Foco Exclusivo em Conteúdo)

O Editor é a conta mais restrita da plataforma. É ideal para assessores de imprensa, agências de marketing parceiras ou profissionais contratados temporariamente para atualizar dados textuais.

#### ⚙️ Funcionalidades Disponíveis:

1. **Editor Global (CMS) - Abas Permitidas:**
   * O Editor tem acesso **apenas às abas do CMS liberadas** pelo Super Admin na sua tela de cadastro.
   * Geralmente, o Editor é encarregado de:
     * Atualizar textos da seção "Sobre Nós" (`tab-home-sobre`).
     * Editar banners e frases de destaque da página inicial (`tab-home-hero`).
     * Atualizar dados de contato e rodapé (`tab-footer`).
     * Adicionar e atualizar páginas legais (Políticas de Privacidade e Termos de Uso).
   * O painel é simplificado para este usuário: ao fazer o login, o sidebar e o header exibem apenas os recursos de conteúdo permitidos, ocultando totalmente opções estruturais e métricas financeiras ou de tráfego.

2. **Gerenciamento de Perfil:**
   * O Editor pode alterar seus próprios dados de login (Nome, E-mail e Senha) a qualquer momento através do menu **"Meu Perfil"** (`/admin/perfil`).

*🚫 **O que o Editor NÃO pode fazer:** O Editor tem bloqueio de rota absoluto para Gestão de Usuários, Configurações Gerais, e qualquer módulo que envolva controle financeiro, faturamento, licenciamento ou configurações técnicas de servidor.*

---

## 🔒 Boas Práticas de Segurança Recomendadas

1. **Alterar Senhas Iniciais:** Após a primeira instalação, o Super Admin deve acessar `/admin/usuarios/editar/1` (ou no painel correspondente) e alterar o e-mail e a senha padrão `ET.2026*`.
2. **Uso de SSL/HTTPS:** Nunca trafegue credenciais no painel administrativo sem o certificado SSL ativo (cadeado verde na barra de endereços).
3. **Limitação de Acesso:** Evite criar múltiplos Super Admins. Conceda o nível `admin` com permissões específicas para o dia a dia.
