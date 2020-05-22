/*-- Tipo de usuarios
CREATE TABLE typeofuser (
    id SERIAL PRIMARY KEY,
    usertype VARCHAR(40),
    valuedata INTEGER DEFAULT null
);
INSERT INTO typeofuser(usertype, valuedata) VALUES ('AdminUser', null), ( 'SimpleUser', 1);

-- Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    emailuser text,
    nameuser VARCHAR(40),
    passworduser VARCHAR(255),
    typeiduser INTEGER REFERENCES typeofuser(id)
);

INSERT INTO users(emailuser, nameuser, passworduser, typeiduser) VALUES ('gmayas@gmail.com', 'gmayas', 'p1000',1), ('karen@gmail.com', 'karen', 'p2000', 2), ('andres@gmail.com', 'andres', 'p3000',2);

-- position

CREATE TABLE position (
    id SERIAL PRIMARY KEY,
    idvehicles INTEGER,
    latitude NUMERIC,
    longitude NUMERIC,
    zoom NUMERIC(3)
);

INSERT INTO position(idvehicles, latitude, longitude, zoom) VALUES (1, 21.161006, 86.830486, 50);
INSERT INTO position(idvehicles, latitude, longitude, zoom) VALUES (1, 22.161006, 87.830486, 50);

-- Vehiculos

CREATE TABLE vehicles(
    id SERIAL PRIMARY KEY,
    plates VARCHAR(10),
    make VARCHAR(255),
    color VARCHAR(16),
    model VARCHAR(4), 
    userid INTEGER REFERENCES users(id),
    positiongps INTEGER REFERENCES position(id)
);


INSERT INTO vehicles(plates, make, color, model, userid, positiongps) 
VALUES ('GMS-7502', 'VW', 'BACK', '1992', 1, NULL);

UPDATE vehicles
SET positiongps = 1
WHERE id = 1;

-- Disparadores, actuliza la actual posiscion del vehiculo

CREATE FUNCTION newposition_funcion() RETURNS TRIGGER AS $$
BEGIN

UPDATE vehicles
SET positiongps = NEW.id
WHERE id = NEW.idvehicles;

RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER newposition_trigger AFTER INSERT ON position FOR EACH ROW EXECUTE PROCEDURE newposition_funcion();

*/