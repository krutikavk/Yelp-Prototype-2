
var app = require('./app');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
const api_host = 'http://localhost'
const api_port = "3001"
const api_url = api_host + ':' + api_port

var expect = chai.expect


describe('Yelp', function(){
  it("Get all customers", function(done){
    chai
      .request(api_url)
      .get('/customers')
      .send()
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        done();
      })
  });
})


describe('Yelp', function(){
  it("Get all restaurants", function(done){
    chai
      .request(api_url)
      .get('/restaurants')
      .send()
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        done();
      })
  });
})



describe('Yelp', function(){
  it("Restaurant login", function(done){
    let data1 = {
      remail: "user1@user1.com",
      rpassword: "user1"
    }
    let data2 = {
      remail: "rest1@rest1.com",
      rpassword: "rest1"
    }
    chai
      .request(api_url)
      .post('/restaurants/login')
      .send(data1)
      .end(function(err, res) {
        expect(res).to.have.status(400);
      })

    chai
      .request(api_url)
      .post('/restaurants/login')
      .send(data2)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        done();
      })
    
  });
})


describe('Yelp', function(){
  it("Customer signup", function(done){
    let data1 = {
      cname: "Existing",
      cemail: "user1@user1.com",
      cpassword: "user1"
    }

    let data2 = {
      cname: "New",
      cemail: "testy@testy.com",
      cpassword: "test123"
    }
    chai
      .request(api_url)
      .post('/customers')
      .send(data1)
      .end(function(err, res) {
        expect(res).to.have.status(400);
    })

    chai
      .request(api_url)
      .post('/customers')
      .send(data2)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
    })
     
    
  });
})



/*
describe('Yelp', function(){
  it("Place order for customer 1", function(done){
    let data = {
      cid: 1,
      rid: 1,
      ooption: "Pickup",
      ostatus: "Order received",
      otype: "New",
      oaddress: "",
      odishes: [],
    }
    chai
      .request(api_url)
      .post('/orders/')
      .send(data)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        expect(res.data).to.be.a('array');
        expect(res.data).to.have.lengthOf(1)
        done();
      })

    chai
      .request(api_url)
      .get('/orders/customers/' + 1)
      .send()
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        done();
      })
    
  });
})
*/


