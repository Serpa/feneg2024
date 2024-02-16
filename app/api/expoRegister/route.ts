import nodemailer from 'nodemailer';
import FormEmail from '@/components/formEmail';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {

    const form = await req.json()

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'feneg2023@gmail.com',
            pass: process.env.MAIL_PASS,
        }
    });
    const mailOptions = {
        from: 'queroexpor@feneg.com.br',
        to: 'feneg@sicoobfrutal.com.br',
        subject: `Novo Cadastro de Interesse - ${form.nome}`,
        html: `
        <!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Interesse em Exposição - FENEG 2024</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    header {
      text-align: center;
    }

    header img {
      max-width: 200px;
    }

    h1 {
      font-size: 24px;
      margin-top: 0;
    }

    h2 {
      font-size: 20px;
      margin-top: 20px;
    }

    p {
      margin-bottom: 10px;
    }

    a {
      color: #0073b7;
      text-decoration: none;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
    }

    .footer p {
      font-size: 14px;
    }
  </style>
</head>

<body>
  <div class="container">
    <header>
      <img src="https://i.imgur.com/kFqYTBf.png" alt="Logo do Evento">
      <h1>FENEG 2024 - Feira de Negócios Sicoob Frutal.</h1>
      <h2>22 A 25 de Maio.</h2>
    </header>

    <p>Olá equipe!</p>

    <p>Informamos que um novo formulário de interesse em exposição foi preenchido por ${form.nome}.</p>

    <h2>Dados do Interessado:</h2>

    <ul>
      <li>Nome: ${form.nome}</li>
      <li>Empresa/Organização: ${form.empresa}</li>
      <li>Segmento de atuação: ${form.ramo}</li>
      <li>E-mail: ${form.email}</li>
      <li>Telefone: ${form.telefone}</li>
    </ul>

    <p>Solicitamos que analisem o formulário e entrem em contato com o interessado.</p>

    <div class="footer">
      <p>Agradecemos a atenção.</p>

      <p>Equipe FENEG 2024</p>
    </div>
  </div>
</body>

</html>`
    };

    try {
        await new Promise((resolve, reject) => {
            // verify connection configuration
            transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });

        await new Promise((resolve, reject) => {
            // send mail
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    // console.log(info);
                    resolve(info);
                }
            });
        });
        const insertDB = await prisma.expoForm.create({
            data: form
        })

        return new Response(JSON.stringify(insertDB), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }

}