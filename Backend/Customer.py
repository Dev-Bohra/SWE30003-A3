import datetime
import re

class Customer:
    def __init__(self,id,name,passwordHash,email,number,address,regDate):
        self._id = id
        self._name = name
        self._email = email
        self._number = number
        self._address = address
        self._regDate = datetime.now()

    @property
    def id(self):
        return self._id
    @id.setter
    def id(self,value): 
        if not isinstance(value,int):
            raise TypeError("ID needs to be a whole number")
        if value < 0 :
            raise ValueError("ID cannot be negative")
        
    @property
    def name(self):
        return self._name
    @name.setter
    def name(self,value):
        if not isinstance(value,str):
            raise TypeError("Name must be a string")
        if any(char.isdigit() for char in value):
            raise ValueError("Name cannot contain numbers.")
        self._name = value
        
    @property
    def email(self):
        return self._email
    @email.setter
    def email(self,value):
        if not isinstance(value,str):
            raise TypeError("Email must be a string")
        pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(pattern,value):
            raise ValueError("Email Format is Incorrect")
        self._email = value

    @property
    def number(self):
        return self._number
    @number.setter
    def number(self,value):
        if not isinstance(value,str):
            raise TypeError("Phone Number must be a string")
        cleaned = value.strip()
        if re.match(r"^04\d{8}$",cleaned):
            cleaned = cleaned[1:]
        if not re.match(r"^04\d{8}$",cleaned):
            raise ValueError("Phone number must 9 digits starting with 4")
        self._number = f"+61{cleaned}"
    
    @property
    # Read Only Property 
    def regDate(self):
        return self._regDate
    
    

