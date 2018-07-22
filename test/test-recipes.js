const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, runServer, closeServer } = require("../server");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Recipes", function(){
  before(function(){
    return runServer();
  })

  after(function(){
    return closeServer();
  })

  it('should show recipe items on GET', function(){
    return chai
      .request(app)
      .get('/recipes')
      .then(function(res){
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.a('array')
        expect(res.body.length).to.be.at.least(1)

        const expectedKeys = ['name', 'id', 'ingredients']
        res.body.forEach(function(item){
          expect(item).to.be.a('object')
          expect(item).to.include.keys(expectedKeys)
        })
      })
  })
  it('should add an item on POST', function(){
    const newItem = {name: "tofu tacos", ingredients: ["tofu", "tortillas", "avocado"]}
    return chai
      .request(app)
      .post('/recipes')
      .send(newItem)
      .then(function(res){
        expect(res).to.have.status(201)
        expect(res).to.be.json
        expect(res.body).to.be.a('object')
        expect(res.body).to.include.keys('name', 'id', 'ingredients')
        expect(res.body).to.deep.equal(
          Object.assign(newItem, {id: res.body.id})
        )
      })
  })
  it('should update recipe items on PUT', function(){
    const updateData = {
      name: 'bar',
      ingredients: ['buzz', 'bop']
    }

    return (
      chai
        .request(app)
        .get('/recipes')
        .then(function(res){
          updateData.id = res.body[0].id
          return chai
            .request(app)
            .put(`/recipes/${updateData.id}`)
            .send(updateData)
        })
        .then(function(res){
          expect(res).to.have.status(204)
          // expect(res).to.be.json
          // expect(res.body).to.be.a('object')
          // expect(res.body).to.be.deep.equal(updateData)
        })
    )
  })
  it('should delete item on DELETE', function(){
    return (
      chai
        .request(app)
        .get('/recipes')
        .then(function(res){
          return chai.request(app).delete(`/recipes/${res.body[0].id}`)
        })
        .then(function(res){
          expect(res).to.have.status(204)
        })
    )
  })
})
