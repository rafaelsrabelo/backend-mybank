require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const  bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

//config JSON respnose
app.use(express.json());

//Models
const User = require('./models/User');
const Transaction = require('./models/Transaction');

app.get('/', (req, res) => {
  res.status(200).json({ msg: "Backend on fire!🔥"})
})

// private route
app.get('/user/:id', checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id, '-password');

  if(!user) {
    return res.status(404).json({ msg: 'user não encontrado'})
  }

  return res.status(200).json({ user })
})

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split("")[1]

  if(!token) {
    return res.status(401).json({ msg: "acesso negado!" })
  }

  try {
    const secret = process.env.SECRET

    jwt.verify(token, secret)
    next()
  } catch (error) {
    res.status(400).json({ msg: 'token inválido' })
  }
}

// get transaction
  app.get('/transactions', async (req, res) => {
    try {
      const transctionsList = await Transaction.find();
      return res.json({transctionsList})
    } catch (error) {
      console.log(error)
    }
  })

// create transaction
app.post('/transactions', async (req, res) => {
  const { name, amount, type, created_at} = req.body;

  if(!name) {
    return res.status(422).json({ msg: 'Campo nome é obrigatório'})
  }

  if(!amount) {
    return res.status(422).json({ msg: 'Campo valor é obrigatório'})
  }

  if(!type) {
    return res.status(422).json({ msg: 'Campo tipo é obrigatório'})
  }

  const transaction = new Transaction({ 
    name,
    amount,
    type,
    created_at
  })

  try {
    await transaction.save();
    res.status(201).json({ msg: `transação criada com sucesso! ${transaction}`})
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error})
  }

})

// create user
app.post('/create-user', async (req, res) => {
  const { name, email, password, password_confirmation } = req.body;

  if(!name) {
    return res.status(422).json({ msg: 'Campo nome é obrigatório'})
  }

  if(!email) {
    return res.status(422).json({ msg: 'Campo email é obrigatório'})
  }

  if(!password) {
    return res.status(422).json({ msg: 'Campo senha é obrigatório'})
  }

  if(!password_confirmation) {
    return res.status(422).json({ msg: 'Campo confirmação de senha é obrigatório'})
  }

  if(password !== password_confirmation) {
    return res.status(422).json({ msg: 'As senhas não conferem'})
  }

  const userExists = await User.findOne({ email: email });

  if(userExists) {
    return res.status(422).json({msg: 'Emai já cadastrado!'})
  }

  // create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt)

  //create user 
  const user = new User({ 
    name,
    email,
    password: passwordHash
  })

  try {
    await user.save();
    res.status(201).json({ msg: `usuario criado com sucesso! ${user}`})
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error})
  }
})

app.post('/login', async (req, res) => {
  const {email, password} = req.body;

  if(!email) {
    return res.status(422).json({ msg: 'Campo email é obrigatório'})
  }

  if(!password) {
    return res.status(422).json({ msg: 'Campo senha é obrigatório'})
  }

  const user = await User.findOne({ email: email });

  if(!user) {
    return res.status(404).json({ msg: 'Usuário não cadastrado!'})
  }

  const checkPassword = await bcrypt.compare(password, user.password)

  if(!checkPassword) {
    return res.status(422).json({ msg: 'Senha inválida' })
  }

  try {
    const secret = process.env.SECRET

    const token = jwt.sign({
      id: user._id
    }, secret,
    )
    res.status(200).json({ msg: 'Usuário logado', token, user})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error})
  }
})

// credentials 
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
mongoose.set("strictQuery", true);
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.beefml3.mongodb.net/?retryWrites=true&w=majority`,)
.then(() => {
  app.listen(3000)
  console.log('database connection!')
}).catch((err) => console.log(err))
