import express from 'express';
import firebaseServices from '../services/firebaseService.js';
import { JWTSecret } from '../config.js';
import { SignJWT, jwtVerify } from 'jose';
var router = express.Router();

const encoder = new TextEncoder();
const secretKey = encoder.encode(JWTSecret);

// Get para listar os usuarios
router.get('/', async (req, res) => {
    let token = req.get('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não informado.' });
    }
    token = token.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token inválido.' });
    }

    jwtVerify(token, secretKey, { algorithms: ['HS256'] })
        .then(({ payload }) => {
            res.send(payload);
        })
        .catch((error) => {
            if (error.code === 'ERR_JWT_EXPIRED') {
                res.status(401).json({ error: 'O token expirou.' });
            } else {
                res.status(401).json({ error: 'Token inválido, tente novamente.' });
            }
        });
});

// Post para criar um novo usuario
router.post('/login', async (req, res) => {
    firebaseServices.loginEmailSenha(req.body.email, req.body.password)
        .then((user) => {
            console.log(user);
            let payload = {
                email: user.email,
                uid: user.uid,
            };

            new SignJWT(payload)
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('2h')
                .setJti('123')
                .sign(secretKey)
                .then((token) => {
                    res.status(200).json({ token });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: 'Erro ao gerar o token.' });
                });
        })
        .catch((error) => {
            console.error(error);
            if (error.code === 'auth/user-not-found') {
                res.status(401).json({ error: 'Usuário não encontrado.' });
            } else if (error.code === 'auth/wrong-password') {
                res.status(401).json({ error: 'Senha incorreta.' });
            } else {
                res.status(500).json({ error: 'Erro ao autenticar o usuário.' });
            }
        });
});

// Post para registrar um novo usuario
router.post('/register', async (req, res) => {
    const { email, password, nome, tipo } = req.body;
    firebaseServices.registrarNovoUsuario(
        email,
        password,
        nome,
        tipo,
        (user) => {
            console.log('Usuário registrado com sucesso:', user.uid);
            let payload = {
                email: user.email,
                uid: user.uid,
            };

            new SignJWT(payload)
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('2h')
                .setJti('123')
                .sign(secretKey) 
                .then((token) => {
                    res.status(201).json({ token });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: 'Erro ao gerar o token.' });
                });
        },
        (errorCode, errorMessage) => {
            console.error('Erro ao registrar usuário:', errorCode, errorMessage);
            if (errorCode === 'auth/email-already-in-use') {
                res.status(400).json({ error: 'Email já está em uso.' });
            } else {
                res.status(500).json({ error: 'Erro ao registrar o usuário.' });
            }
        }
    );
});
export default router;