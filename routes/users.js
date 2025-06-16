import express from 'express';
import firebaseServices from '../services/firebaseService.js';
import { JWTSecret } from '../config.js';
import { SignJWT, jwtVerify } from 'jose';
var router = express.Router();

// Get para listar os usuarios

router.get('/', async (req, res) => {
    let token = req.get('Authorization');
    if (!token) {
        res.status(401).json({ error: 'Login não autorizado, token não informado.' });
        return;
    }
    token = token.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Login não autorizado, o token é invalido.' });
        return;
    }

    jwtVerify(token, JWTSecret, { algorithms: ['HS256'] })
        .then(({ payload }) => {
            res.send(payload);
        })
        .catch((error) => {
            console.log(error);
            if (error.code === 'ERR_JWT_EXPIRED') {
                res.status(401).json({ error: 'O token expirou. Tente novamente.' });
            } else {
                res.status(401).json({ error: 'Token invalido. Tente novamente.' });
            }
            return;
        });
});

// Post para criar um novo usuario
router.post('/login', async (req, res) => {
    firebaseServices.login(req.body.email, req.body.password)
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
                .sign(JWTSecret)
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

export default router;