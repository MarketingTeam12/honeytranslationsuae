CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(120) NOT NULL UNIQUE,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(160) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_content TEXT NOT NULL,
  featured_image VARCHAR(500) DEFAULT NULL,
  category_id INT NOT NULL,
  author VARCHAR(160) DEFAULT NULL,
  read_time VARCHAR(40) NOT NULL,
  publish_date DATE DEFAULT NULL,
  meta_title VARCHAR(255) DEFAULT NULL,
  meta_description TEXT DEFAULT NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_blogs_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS blog_slug_aliases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blog_id INT NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_blog_alias_blog
    FOREIGN KEY (blog_id) REFERENCES blogs(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_category_id ON blogs(category_id);
CREATE INDEX idx_blogs_publish_date ON blogs(publish_date);
CREATE INDEX idx_blogs_created_at ON blogs(created_at);
CREATE INDEX idx_blog_aliases_blog_id ON blog_slug_aliases(blog_id);
