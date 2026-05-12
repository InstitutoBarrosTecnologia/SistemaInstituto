/**
 * Templates HTML profissionais para envio de e-mail
 * Utiliza variáveis dinâmicas no formato {{variavel}}
 */

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  variables: string[]; // Lista de variáveis suportadas
}

/**
 * TEMPLATE 1: Newsletter/Informativo
 * Design moderno com ilustrações e ícones
 */
const newsletterTemplate: EmailTemplate = {
  id: 'newsletter',
  name: 'Newsletter/Informativo',
  description: 'Template moderno e ilustrado para novidades e comunicados',
  variables: ['nome_cliente', 'titulo', 'empresa', 'ano_atual'],
  html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{titulo}}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      background: linear-gradient(135deg, #0b1f4d 0%, #1a3a6e 100%);
      padding: 40px 20px;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #ffffff; 
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .header {
      background: linear-gradient(135deg, #0b1f4d 0%, #1a3a6e 100%);
      padding: 50px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    }
    .logo { 
      max-width: 200px; 
      height: auto; 
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    .header-title {
      color: white;
      font-size: 18px;
      font-weight: 300;
      letter-spacing: 2px;
      position: relative;
      z-index: 1;
    }
    .hero-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto 30px;
      background: linear-gradient(135deg, #0b1f4d 0%, #1a3a6e 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(11, 31, 77, 0.3);
      border: 5px solid white;
      overflow: hidden;
      position: relative;
    }
    .hero-icon svg {
      position: relative;
      z-index: 2;
    }
    .body { 
      padding: 20px 40px 40px;
    }
    .greeting {
      font-size: 18px;
      color: #0b1f4d;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .greeting strong {
      color: #1a3a6e;
      font-size: 20px;
    }
    h1 { 
      color: #2d3748; 
      font-size: 32px; 
      margin-bottom: 25px;
      font-weight: 700;
      line-height: 1.2;
    }
    .content { 
      color: #4a5568; 
      line-height: 1.8;
      font-size: 16px;
    }
    .content p {
      margin-bottom: 15px;
    }
    .divider {
      height: 3px;
      background: linear-gradient(90deg, #0b1f4d 0%, #1a3a6e 100%);
      margin: 35px 0;
      border-radius: 10px;
    }
    .signature {
      background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%);
      padding: 25px;
      border-radius: 15px;
      border-left: 5px solid #0b1f4d;
      margin-top: 30px;
    }
    .signature p {
      margin: 0;
      color: #4a5568;
      font-size: 15px;
    }
    .signature strong {
      color: #0b1f4d;
      font-size: 17px;
    }
    .footer { 
      background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
      padding: 40px 30px;
      text-align: center;
      color: #a0aec0;
    }
    .footer-title {
      color: white;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 15px;
    }
    .footer-contact {
      margin: 8px 0;
      font-size: 14px;
    }
    .footer-contact a {
      color: #0b1f4d;
      text-decoration: none;
    }
    .footer-icons {
      margin: 25px 0 20px;
      display: flex;
      gap: 15px;
      justify-content: center;
    }
    .social-icon {
      width: 40px;
      height: 40px;
      background: rgba(11, 31, 77, 0.2);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }
    .social-icon:hover {
      background: #0b1f4d;
      transform: translateY(-3px);
    }
    .copyright {
      color: #718096;
      font-size: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(160, 174, 192, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header com gradiente -->
    <div class="header">
      <img src="${window.location.origin}/images/logo/instituto-barros-logo-branco.webp" alt="Instituto Barros" class="logo">
      <p class="header-title">{{empresa}}</p>
    </div>

    <!-- Ícone Hero -->
    <div class="hero-icon">
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
        <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Body -->
    <div class="body">
      <p class="greeting">Olá, <strong>{{nome_cliente}}</strong>! 👋</p>
      
      <h1>{{titulo}}</h1>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 15px;">
          Temos <strong style="color: #0b1f4d;">ótimas novidades</strong> para compartilhar com você! Nossa equipe está sempre trabalhando para oferecer o melhor atendimento e cuidado.
        </p>
        <p style="font-size: 16px; margin-bottom: 15px;">
          Confira algumas das novidades que preparamos especialmente para você:
        </p>
        <ul style="margin: 20px 0; padding-left: 25px;">
          <li style="margin-bottom: 12px; font-size: 15px;">✨ <strong>Novos serviços</strong> disponíveis para melhor atendê-lo</li>
          <li style="margin-bottom: 12px; font-size: 15px;">📅 <strong>Agendamento online</strong> mais rápido e prático</li>
          <li style="margin-bottom: 12px; font-size: 15px;">🎯 <strong>Atendimento personalizado</strong> focado em você</li>
          <li style="margin-bottom: 12px; font-size: 15px;">💎 <strong>Promoções exclusivas</strong> para nossos clientes</li>
        </ul>
        <p style="font-size: 16px; margin-top: 20px;">
          Estamos à disposição para qualquer dúvida ou agendamento. Entre em contato conosco!
        </p>
      </div>

      <div class="divider"></div>

      <div class="signature">
        <p>
          ✨ Atenciosamente,<br>
          <strong>Equipe {{empresa}}</strong>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-title">{{empresa}}</div>
      <p class="footer-contact">📧 contato@institutobarros.com.br</p>
      <p class="footer-contact">📞 (11) 1234-5678</p>
      <p class="footer-contact">📍 Endereço da clínica, Cidade - Estado</p>
      
      <div class="footer-icons">
        <a href="#" class="social-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href="#" class="social-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a href="#" class="social-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
      
      <p class="copyright">© {{ano_atual}} {{empresa}}. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
};

/**
 * TEMPLATE 2: Promocional/Marketing
 * Design super vibrante com ilustrações e CTAs destacados
 */
const promocionalTemplate: EmailTemplate = {
  id: 'promocional',
  name: 'Promocional/Marketing',
  description: 'Template vibrante e ilustrado para promoções e ofertas especiais',
  variables: ['nome_cliente', 'titulo', 'cta_texto', 'cta_link', 'empresa', 'ano_atual'],
  html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{titulo}}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      background: linear-gradient(135deg, #0b1f4d 0%, #1a3a6e 100%);
      padding: 40px 20px;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #ffffff; 
      border-radius: 25px;
      overflow: hidden;
      box-shadow: 0 25px 70px rgba(0,0,0,0.3);
    }
    .header {
      background: linear-gradient(135deg, #0b1f4d 0%, #1a3a6e 100%);
      padding: 60px 30px 80px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '🎉';
      position: absolute;
      top: 20px;
      left: 30px;
      font-size: 60px;
      opacity: 0.3;
      animation: float 3s ease-in-out infinite;
    }
    .header::after {
      content: '✨';
      position: absolute;
      bottom: 30px;
      right: 30px;
      font-size: 60px;
      opacity: 0.3;
      animation: float 3s ease-in-out infinite 1.5s;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    .logo { 
      max-width: 200px; 
      height: auto; 
      margin-bottom: 20px;
      filter: drop-shadow(0 5px 15px rgba(0,0,0,0.2));
      position: relative;
      z-index: 1;
    }
    .header-title {
      color: white;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 1px;
      position: relative;
      z-index: 1;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .promo-badge {
      background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
      color: #d97706;
      padding: 30px 40px;
      margin: 0 30px 30px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4);
      position: relative;
      z-index: 2;
      border: 4px solid white;
    }
    .promo-badge::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: linear-gradient(45deg, #f093fb, #f5576c, #ffd700);
      border-radius: 25px;
      z-index: -1;
      animation: rotate 4s linear infinite;
      opacity: 0.5;
    }
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .promo-title {
      font-size: 36px;
      font-weight: 900;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      line-height: 1;
    }
    .promo-subtitle {
      font-size: 18px;
      font-weight: 600;
      opacity: 0.9;
    }
    .body { 
      padding: 20px 40px 40px;
    }
    .greeting {
      font-size: 20px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .greeting strong {
      color: #0b1f4d;
      font-size: 22px;
    }
    h1 { 
      color: #2d3748; 
      font-size: 36px; 
      margin-bottom: 25px;
      font-weight: 800;
      line-height: 1.2;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .content { 
      color: #4a5568; 
      line-height: 1.9;
      font-size: 16px;
    }
    .content p {
      margin-bottom: 15px;
    }
    .cta-section {
      text-align: center;
      margin: 40px 0;
      padding: 40px 20px;
      background: linear-gradient(135deg, #fff5f7 0%, #fff9e6 100%);
      border-radius: 20px;
      border: 3px dashed #f5576c;
    }
    .cta-button {
      display: inline-block;
      padding: 18px 50px;
      background: linear-gradient(135deg, #0b1f4d 0%, #1a3a6e 100%);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 18px;
      box-shadow: 0 10px 30px rgba(11, 31, 77, 0.4);
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    .cta-button::before {
      content: '→';
      position: absolute;
      right: 20px;
      opacity: 0;
      transition: all 0.3s;
    }
    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(11, 31, 77, 0.5);
      padding-right: 60px;
    }
    .cta-button:hover::before {
      opacity: 1;
      right: 25px;
    }
    .countdown-box {
      background: linear-gradient(135deg, #fee2e2 0%, #fef3c7 100%);
      padding: 20px;
      border-radius: 15px;
      margin: 30px 0;
      border-left: 5px solid #f59e0b;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .countdown-icon {
      font-size: 40px;
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    .countdown-text {
      color: #92400e;
      font-size: 15px;
      font-weight: 600;
      margin: 0;
    }
    .features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 30px 0;
    }
    .feature-item {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
      padding: 20px;
      border-radius: 15px;
      text-align: center;
      border: 2px solid #dbeafe;
    }
    .feature-icon {
      font-size: 35px;
      margin-bottom: 10px;
    }
    .feature-text {
      color: #1e40af;
      font-size: 14px;
      font-weight: 600;
      margin: 0;
    }
    .footer { 
      background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
      padding: 40px 30px;
      text-align: center;
      color: #a0aec0;
    }
    .footer-title {
      color: white;
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 15px;
    }
    .footer-contact {
      margin: 8px 0;
      font-size: 14px;
    }
    .social-links {
      margin: 25px 0;
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .social-btn {
      width: 45px;
      height: 45px;
      background: rgba(11, 31, 77, 0.2);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }
    .social-btn:hover {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      transform: translateY(-3px) rotate(360deg);
    }
    .copyright {
      color: #718096;
      font-size: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(160, 174, 192, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header com animação -->
    <div class="header">
      <img src="${window.location.origin}/images/logo/instituto-barros-logo-branco.webp" alt="Instituto Barros" class="logo">
      <p class="header-title">{{empresa}}</p>
    </div>

    <!-- Badge Promocional Destacado -->
    <div class="promo-badge">
      <div class="promo-title">🎁 OFERTA ESPECIAL 🎁</div>
      <div class="promo-subtitle">Não perca esta oportunidade única!</div>
    </div>

    <!-- Body -->
    <div class="body">
      <p class="greeting">
        <span style="font-size: 30px;">👋</span>
        <span>Olá, <strong>{{nome_cliente}}</strong>!</span>
      </p>
      
      <h1>{{titulo}}</h1>
      
      <div class="content">
        <p style="font-size: 17px; margin-bottom: 18px;">
          Preparamos uma <strong style="color: #f5576c;">oferta especial</strong> exclusiva para você! Esta é uma oportunidade única de aproveitar condições imperdíveis.
        </p>
        <p style="font-size: 17px; margin-bottom: 18px;">
          Por tempo limitado, você terá acesso a:
        </p>
        <ul style="margin: 25px 0; padding-left: 25px;">
          <li style="margin-bottom: 15px; font-size: 16px;">🎁 <strong>Descontos exclusivos</strong> em todos os serviços</li>
          <li style="margin-bottom: 15px; font-size: 16px;">⚡ <strong>Atendimento prioritário</strong> para agendamentos</li>
          <li style="margin-bottom: 15px; font-size: 16px;">💎 <strong>Bônus especiais</strong> para você</li>
          <li style="margin-bottom: 15px; font-size: 16px;">🎯 <strong>Condições facilitadas</strong> de pagamento</li>
        </ul>
        <p style="font-size: 17px; margin-top: 20px; color: #f5576c; font-weight: 600;">
          Não deixe essa oportunidade passar! Clique no botão abaixo e garanta já sua vaga.
        </p>
      </div>

      <!-- Features em Grid -->
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <p class="feature-text">Rápido e Fácil</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🎯</div>
          <p class="feature-text">Resultados Garantidos</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💎</div>
          <p class="feature-text">Qualidade Premium</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🏆</div>
          <p class="feature-text">Melhor Escolha</p>
        </div>
      </div>

      <!-- CTA Principal -->
      <div class="cta-section">
        <a href="{{cta_link}}" class="cta-button">
          {{cta_texto}}
        </a>
      </div>

      <!-- Contador/Urgência -->
      <div class="countdown-box">
        <div class="countdown-icon">⏰</div>
        <p class="countdown-text">
          <strong>ATENÇÃO:</strong> Esta é uma oferta por tempo limitado! Aproveite agora antes que acabe!
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-title">{{empresa}}</div>
      <p class="footer-contact">📧 contato@institutobarros.com.br</p>
      <p class="footer-contact">📞 (11) 1234-5678</p>
      <p class="footer-contact">📍 Endereço da clínica, Cidade - Estado</p>
      
      <div class="social-links">
        <a href="#" class="social-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href="#" class="social-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a href="#" class="social-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
      
      <p class="copyright">© {{ano_atual}} {{empresa}}. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
};

/**
 * TEMPLATE 3: Transacional/Confirmação
 * Design moderno com ícones e layout limpo
 */
const transacionalTemplate: EmailTemplate = {
  id: 'transacional',
  name: 'Transacional/Confirmação',
  description: 'Template moderno e ilustrado para confirmações e notificações',
  variables: ['nome_cliente', 'titulo', 'data_atual', 'hora', 'empresa', 'ano_atual'],
  html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{titulo}}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
      padding: 40px 20px;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #ffffff; 
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15);
      border: 2px solid #bfdbfe;
    }
    .header {
        background: linear-gradient(135deg, #0b1f4d 0%, #1a3a6e 100%);
      padding: 30px;
      text-align: center;
      position: relative;
    }
    .logo { 
      max-width: 180px; 
      height: auto;
      filter: brightness(0) invert(1);
    }
    .success-badge {
      width: 120px;
      height: 120px;
      margin: 0 auto 30px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 15px 40px rgba(16, 185, 129, 0.3);
      border: 6px solid white;
      position: relative;
      z-index: 2;
      overflow: hidden;
    }
    .success-badge::before {
      content: '';
      position: absolute;
      width: 140px;
      height: 140px;
      border: 3px solid #10b981;
      border-radius: 50%;
      opacity: 0.3;
      animation: ripple 2s ease-out infinite;
    }
    @keyframes ripple {
      0% { transform: scale(1); opacity: 0.3; }
      100% { transform: scale(1.3); opacity: 0; }
    }
    .checkmark {
      width: 60px;
      height: 60px;
      stroke: white;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
      animation: draw 1s ease-in-out;
    }
    @keyframes draw {
      0% { stroke-dasharray: 0, 100; }
      100% { stroke-dasharray: 100, 0; }
    }
    .body { 
      padding: 20px 40px 40px;
      text-align: center;
    }
    h1 { 
      color: #1e40af; 
      font-size: 32px; 
      margin-bottom: 15px;
      font-weight: 700;
    }
    .subtitle {
      color: #6b7280;
      font-size: 18px;
      margin-bottom: 30px;
    }
    .subtitle strong {
      color: #3b82f6;
      font-weight: 700;
    }
    .content { 
      color: #4a5568; 
      line-height: 1.8;
      font-size: 16px;
      text-align: left;
      margin: 30px 0;
    }
    .info-card {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 2px solid #93c5fd;
      border-radius: 20px;
      padding: 30px;
      margin: 30px 0;
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.1);
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 2px dotted #bfdbfe;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #1e40af;
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .info-icon {
      font-size: 24px;
    }
    .info-value {
      color: #1f2937;
      font-weight: 700;
      font-size: 16px;
    }
    .alert-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid #fbbf24;
      border-radius: 15px;
      padding: 20px;
      margin: 30px 0;
      display: flex;
      align-items: start;
      gap: 15px;
      text-align: left;
    }
    .alert-icon {
      font-size: 35px;
      flex-shrink: 0;
      animation: swing 2s ease-in-out infinite;
    }
    @keyframes swing {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-10deg); }
      75% { transform: rotate(10deg); }
    }
    .alert-text {
      color: #78350f;
      font-size: 14px;
      font-weight: 600;
      margin: 0;
    }
    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%);
      margin: 35px 0;
    }
    .contact-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #86efac;
      border-radius: 15px;
      padding: 25px;
      text-align: left;
    }
    .contact-title {
      color: #166534;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .contact-item {
      color: #15803d;
      margin: 8px 0;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .footer { 
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      padding: 40px 30px;
      text-align: center;
      color: #94a3b8;
    }
    .footer-title {
      color: white;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 15px;
    }
    .footer-divider {
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
      margin: 15px auto;
      border-radius: 10px;
    }
    .footer-contact {
      margin: 8px 0;
      font-size: 14px;
    }
    .social-row {
      margin: 25px 0;
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .social-icon {
      width: 42px;
      height: 42px;
      background: rgba(59, 130, 246, 0.2);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }
    .social-icon:hover {
        background: linear-gradient(135deg, #0b1f4d 0%, #1a3a6e 100%);
      transform: translateY(-3px);
    }
    .copyright {
      color: #64748b;
      font-size: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(148, 163, 184, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <img src="${window.location.origin}/images/logo/instituto-barros-logo-branco.webp" alt="Instituto Barros" class="logo">
    </div>

    <!-- Badge de Sucesso com Animação -->
    <div class="success-badge">
      <svg class="checkmark" viewBox="0 0 52 52">
        <path d="M14 27l7.5 7.5L38 18" stroke-dasharray="100" stroke-dashoffset="0"/>
      </svg>
    </div>

    <!-- Body -->
    <div class="body">
      <h1>{{titulo}}</h1>
      <p class="subtitle">Olá, <strong>{{nome_cliente}}</strong>! 🎉</p>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 18px;">
          Confirmamos o recebimento da sua solicitação! Estamos muito felizes em tê-lo(a) conosco.
        </p>
        <p style="font-size: 16px; margin-bottom: 18px;">
          Seu agendamento foi registrado com sucesso em nosso sistema. Confira abaixo os detalhes:
        </p>
        <p style="font-size: 16px; margin-top: 20px; color: #1e40af; font-weight: 600;">
          ✅ Tudo certo! Aguardamos você na data e horário marcados.
        </p>
      </div>

      <!-- Card com Informações -->
      <div class="info-card">
        <div class="info-row">
          <span class="info-label">
            <span class="info-icon">📅</span>
            Data
          </span>
          <span class="info-value">{{data_atual}}</span>
        </div>
        <div class="info-row">
          <span class="info-label">
            <span class="info-icon">🕐</span>
            Horário
          </span>
          <span class="info-value">{{hora}}</span>
        </div>
        <div class="info-row">
          <span class="info-label">
            <span class="info-icon">📍</span>
            Local
          </span>
          <span class="info-value">{{empresa}}</span>
        </div>
        <div class="info-row">
          <span class="info-label">
            <span class="info-icon">✅</span>
            Status
          </span>
          <span class="info-value" style="color: #10b981;">Confirmado</span>
        </div>
      </div>

      <!-- Alerta/Lembrete -->
      <div class="alert-box">
        <div class="alert-icon">💡</div>
        <p class="alert-text">
          <strong>Lembrete Importante:</strong> Caso precise remarcar ou cancelar, entre em contato conosco com antecedência. Estamos à disposição!
        </p>
      </div>

      <div class="divider"></div>

      <!-- Card de Contato -->
      <div class="contact-card">
        <div class="contact-title">
          <span>📞</span>
          Precisa de ajuda?
        </div>
        <div class="contact-item">
          <span>📧</span>
          <span>contato@institutobarros.com.br</span>
        </div>
        <div class="contact-item">
          <span>📱</span>
          <span>(11) 1234-5678</span>
        </div>
        <div class="contact-item">
          <span>💬</span>
          <span>WhatsApp: (11) 98765-4321</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-title">{{empresa}}</div>
      <div class="footer-divider"></div>
      <p class="footer-contact">📧 contato@institutobarros.com.br</p>
      <p class="footer-contact">📞 (11) 1234-5678</p>
      <p class="footer-contact">📍 Endereço da clínica, Cidade - Estado</p>
      
      <div class="social-row">
        <a href="#" class="social-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href="#" class="social-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a href="#" class="social-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
      
      <p class="copyright">© {{ano_atual}} {{empresa}}. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
};

/**
 * Exporta todos os templates disponíveis
 */
export const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  newsletter: newsletterTemplate,
  promocional: promocionalTemplate,
  transacional: transacionalTemplate,
};

/**
 * Retorna lista de templates para popular dropdown
 */
export const getTemplateList = (): Array<{ value: string; label: string; description: string }> => {
  return Object.values(EMAIL_TEMPLATES).map(t => ({
    value: t.id,
    label: t.name,
    description: t.description,
  }));
};

/**
 * Retorna um template específico pelo ID
 */
export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return EMAIL_TEMPLATES[id];
};
