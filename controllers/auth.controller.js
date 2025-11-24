const bcrypt = require('bcrypt')
const { usuario, rol, Sequelize } = require('../models')
const { GeneraToken, TiempoRestanteToken } = require('../services/jwttoken.service')
const nodemon = require('nodemon')

let self = {}

// POST: api/auth
self.login = async function (req, res, next){
    const { email, password } = req.body

    try{
        let data = await usuario.findOne({
            where: { email: email },
            raw: true,
            attributes: ['id','email','nombre','passwordhash', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: [] }
        })

        if(data === null)
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos.' })

        // Se compara 
        const passwordMatch = await bcrypt.compare(password, data.passwordhash)
        if (!passwordMatch)
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' })
        
        // Utilizamos los nombres de Claims estandar
        token = GeneraToken(data.email, data.nombre, data.rol)

        // Bitacora
        req.bitacora("usuario.login", data.email)

        res.status(200).json({
            email: data.email,
            nombre: data.nombre,
            rol: data.rol,
            jwt: token
        })
    } catch(error){
        next(error)
    }
}

// POST: api/auth/registro (nuevo usuario)
self.registro = async function (req, res, next) {
    try {
        const { email, password, nombre } = req.body

        if (!email || !password || !nombre) {
            return res.status(400).json({ 
                mensaje: 'Todos los campos son requeridos' 
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                mensaje: 'Formato de email inválido' 
            })
        }

        if (password.length < 8) {
            return res.status(400).json({ 
                mensaje: 'La contraseña debe tener al menos 8 caracteres' 
            })
        }

        const usuarioExistente = await usuario.findOne({ 
            where: { email: email.toLowerCase() } 
        })
        
        if (usuarioExistente) {
            return res.status(409).json({ 
                mensaje: 'El email ya está registrado' 
            })
        }

        const rolUsuario = await rol.findOne({ 
            where: { nombre: 'Usuario' } 
        })
        
        if (!rolUsuario) {
            return res.status(500).json({ 
                mensaje: 'Error en la configuración del sistema' 
            })
        }

        const nuevoUsuario = await usuario.create({
            id: crypto.randomUUID(),
            email: email.toLowerCase(),
            passwordhash: await bcrypt.hash(password, 10),
            nombre: nombre.trim(),
            rolid: rolUsuario.id,
            protegido: false
        })

        req.bitacora("usuarios.registro", nuevoUsuario.email)

        const token = GeneraToken(nuevoUsuario.email, nuevoUsuario.nombre, rolUsuario.nombre)

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            email: nuevoUsuario.email,
            nombre: nuevoUsuario.nombre,
            rol: rolUsuario.nombre,
            jwt: token
        })

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ 
                mensaje: 'El email ya está registrado' 
            })
        }
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                mensaje: 'Datos inválidos',
                detalles: error.errors.map(e => e.message)
            })
        }

        next(error)
    }
}

// GET: api/auth/tiempo
self.tiempo = async function (req, res){
    const tiempo = TiempoRestanteToken(req)
    if(tiempo == null)
        res.status(404).send()
    res.status(200).send(tiempo)
}

module.exports = self