"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Invoice
from api.utils import generate_sitemap, APIException
from flask_cors import CORS


from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# /token Post 
# / this route is for when the user ALREADY exists and needs an access token 
# / create a user query with a conditional to see if the user exists, or return None
@api.route('/token', methods=['POST'])
def generate_token():

    #recieving the request and converting the body of 
    # the request into json format
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    #query the User table to check if the user exists
    email = email.lower()
    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        response = {
           "msg": "Email or Password  does not match."

        }
        return jsonify(response), 401
    access_token = create_access_token(identity=user.id)
    response = {
        "access_token": access_token,
        "User_id": user.id,
        "msg": f'Welcome {user.email}!'
    }
    return jsonify(response), 200


    #create a route  for /signup that will add the user's email and password to the DB
    #POST
    #test that on postman

@api.route('/signup', methods=['POST'])
def register_user():
    email = request.json.get("email", None)
    password = request.json.get('password', None)

    #query to check if the email already exists
    email = email.lower()
    user = User.query.filter_by(email=email).first()

    if user:
        response = {
            "msg": "User already exists."
        }
        return jsonify(response), 403
    
    #if the email does Not exist, go ahead and make a new record in teh DB
    #sign this person up 
    

    user = User()
    user.email = email
    user.password = password
    user.is_active = True
    db.session.add(user)
    db.session.commit()

    response = {
        'msg': f'Congratulations {user.email}. You have successfully signed up!'

    }
    return jsonify(response), 200


    

    #create a route for /invoices that will retrieve and return the users invoices 
    #in json format
    #GET

@api.route('/invoices', methods=['GET'])
@jwt_required()
def get_invoices():
    # Retrieve the user_id of the current user from the access_token
    user_id = get_jwt_identity()
    
    # Fetch the user using the user_id
    user = User.query.filter_by(id=user_id).first()
    
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Fetch all invoices associated with the user_id
    user_invoices = Invoice.query.filter_by(user_id=user_id).all()

    # Process invoices to a serializable format
    processed_invoices = [each_invoice.serialize() for each_invoice in user_invoices]

    response = {
        'msg': f'Hello {user.email}, here are your invoices.',
        'invoices': processed_invoices
    }

    return jsonify(response), 200


