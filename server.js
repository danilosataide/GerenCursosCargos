const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase.js')

const {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
}= require('firebase/firestore')

app.use(express.json())

//OK
app.get('/funcionarios', async (req, res) => {
    const querySnapshot = await db.collection("funcionario").get()
    const funcionarios = []

    querySnapshot.forEach(doc => {
        funcionarios.push({ id: doc.id, data: doc.data() })
    })

    res.send({ status: 200, funcionarios })
})

//OK
app.get('/funcionarios/:doc', async (req, res) => {
    const { doc } = req.params
    const funcionario = []
    if (!doc) {
        return res.sendStatus(404)
    } else {
        var docRef = await db.collection("funcionario").doc(doc);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                funcionario.push({ id: doc.id, data: doc.data() })
                return res.send({ status: 200, funcionario })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
            return res.sendStatus(404)
        });
    }
 
})

//OK
app.post('/addfuncionario', async (req, res) => {
    const funcRef = db.collection("funcionario")
    const {
        nome,
        departamento,
        cidade_trabalho,
        cidade_nascimento,
        sexo,
        data_nascimento,
        cidade_residência,
        data_admissão,
        data_demissão
    } = req.body;
 
    await funcRef.add({
        nome,
        departamento,
        cidade_trabalho,
        cidade_nascimento,
        sexo,
        data_nascimento,
        cidade_residência,
        data_admissão,
        data_demissão
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

    res.status(200).send("ok")
})

app.patch('/changedepartamento/:doc', async (req, res) => {
    const { doc } = req.params
    const { atributo, newStatus } = req.body
    const data = { atributo, newStatus }
    const funcionario = []

    try {
        var docRef = await db.collection("funcionario").doc(doc)
        .update({
            [atributo]: newStatus
        }, { merge: true })
        console.log(funcionario)

        // funcionario = funcionario.push({ id: doc.id, data: doc.data() })

        return res.send({ status: 200, docRef })
    } catch (e) {
        return { message: "Error: ", e }
    }

    
    // if (!doc) {
    //     return res.sendStatus(404)
    // } else {
    //     var docRef = await db.collection("funcionario").doc(doc);
    //     const data = req.body;
    //     await updateDoc(docRef, data);
    //     res.status(200).send('product updated successfully');
    // }

    // const funcRef = db.collection('funcionario').doc(doc)
    // // const res2 = await funcRef.set({
    // //     [departamento]: newStatus
    // // }, { merge: true })
    // res.send({ status: 200, funcRef })
})

app.delete('/friends', async (req, res) => {
    const { name } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.update({
        [name]: FieldValue.delete()
    })
    res.status(200).send(friends)
})

//OK
app.post('/adddependente', async (req, res) => {
  const depRef = db.collection("dependente")
  const {
      nome,
      data_nascimento,
      cidade_nascimento,
      sexo,
      grau,
      funcionario_id
  } = req.body;

  await depRef.add({
      nome,
      data_nascimento,
      cidade_nascimento,
      sexo,
      grau,
      funcionario_id
  })
  .then((depRef) => {
      console.log("Document written with ID: ", depRef.id);
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });

  res.status(200).send("ok")
})

//OK
app.get('/funcionario/:funcionario/dependente', async (req, res) => {
  const { funcionario } = req.params
  const querySnapshot = await db.collection("dependente").get()
  const dependentes = []

  querySnapshot.forEach(doc => {
      if(doc.data().funcionario_id == funcionario){
        dependentes.push({ id: doc.id, data: doc.data() })
      }
  })

  res.send({ status: 200, dependentes })
})

//OK
app.delete('/dependente/:dependente_id', async (req, res) => {
    const { dependente_id } = req.params
    const depRef = db.collection('dependente').doc(dependente_id)
    depRef.delete();

    res.status(200).send("removido")
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))