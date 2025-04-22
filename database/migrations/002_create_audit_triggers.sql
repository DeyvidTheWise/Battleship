CREATE TABLE AuditLog (
  audit_id VARCHAR(36) PRIMARY KEY,
  table_name VARCHAR(50) NOT NULL,
  user_id VARCHAR(36),
  action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  old_data JSON,
  new_data JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

DELIMITER //

CREATE TRIGGER users_audit_insert
AFTER INSERT ON Users
FOR EACH ROW
BEGIN
  INSERT INTO AuditLog (audit_id, table_name, user_id, action, new_data, timestamp)
  VALUES (UUID(), 'Users', NEW.user_id, 'INSERT', JSON_OBJECT(
    'user_id', NEW.user_id,
    'email', NEW.email,
    'username', NEW.username
  ), CURRENT_TIMESTAMP);
END //

CREATE TRIGGER users_audit_update
AFTER UPDATE ON Users
FOR EACH ROW
BEGIN
  INSERT INTO AuditLog (audit_id, table_name, user_id, action, old_data, new_data, timestamp)
  VALUES (UUID(), 'Users', NEW.user_id, 'UPDATE', JSON_OBJECT(
    'user_id', OLD.user_id,
    'email', OLD.email,
    'username', OLD.username
  ), JSON_OBJECT(
    'user_id', NEW.user_id,
    'email', NEW.email,
    'username', NEW.username
  ), CURRENT_TIMESTAMP);
END //

CREATE TRIGGER users_audit_delete
AFTER DELETE ON Users
FOR EACH ROW
BEGIN
  INSERT INTO AuditLog (audit_id, table_name, user_id, action, old_data, timestamp)
  VALUES (UUID(), 'Users', OLD.user_id, 'DELETE', JSON_OBJECT(
    'user_id', OLD.user_id,
    'email', OLD.email,
    'username', OLD.username
  ), CURRENT_TIMESTAMP);
END //

CREATE TRIGGER games_audit_insert
AFTER INSERT ON Games
FOR EACH ROW
BEGIN
  INSERT INTO AuditLog (audit_id, table_name, user_id, action, new_data, timestamp)
  VALUES (UUID(), 'Games', NEW.player1_id, 'INSERT', JSON_OBJECT(
    'game_id', NEW.game_id,
    'mode', NEW.mode,
    'player1_id', NEW.player1_id,
    'player2_id', NEW.player2_id
  ), CURRENT_TIMESTAMP);
END //

CREATE TRIGGER games_audit_update
AFTER UPDATE ON Games
FOR EACH ROW
BEGIN
  INSERT INTO AuditLog (audit_id, table_name, user_id, action, old_data, new_data, timestamp)
  VALUES (UUID(), 'Games', NEW.player1_id, 'UPDATE', JSON_OBJECT(
    'game_id', OLD.game_id,
    'mode', OLD.mode,
    'player1_id', OLD.player1_id,
    'player2_id', OLD.player2_id
  ), JSON_OBJECT(
    'game_id', NEW.game_id,
    'mode', NEW.mode,
    'player1_id', NEW.player1_id,
    'player2_id', NEW.player2_id
  ), CURRENT_TIMESTAMP);
END //

CREATE TRIGGER games_audit_delete
AFTER DELETE ON Games
FOR EACH ROW
BEGIN
  INSERT INTO AuditLog (audit_id, table_name, user_id, action, old_data, timestamp)
  VALUES (UUID(), 'Games', OLD.player1_id, 'DELETE', JSON_OBJECT(
    'game_id', OLD.game_id,
    'mode', OLD.mode,
    'player1_id', OLD.player1_id,
    'player2_id', OLD.player2_id
  ), CURRENT_TIMESTAMP);
END //

DELIMITER ;