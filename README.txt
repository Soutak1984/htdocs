Site backend package
====================

This package contains a PHP + MySQL backend for managing categories, products, and inquiries.
Features included in this ZIP:
- Admin panel (login, dashboard, categories, products, inquiries)
- Product CRUD with image upload and GD-based resizing (if GD extension is available)
- CSV export for products and inquiries (admin)
- Bulk import products from CSV (admin); supports importing referenced image/datasheet files from import directories
- Contact form handler with mail wrapper that uses PHPMailer if installed via Composer, otherwise falls back to mail()
- SQL schema file to create necessary tables

Important setup steps:
1. Import `site_schema.sql` into MySQL to create the database and tables.
2. Create a MySQL user and grant privileges (see earlier instructions).
3. Edit `admin/db.php` and `admin/config.php` to set DB credentials and SMTP settings.
4. To enable PHPMailer SMTP, run `composer require phpmailer/phpmailer` in the project root (the vendor/ directory is not included in this zip).
   If you prefer the zip to contain PHPMailer, tell me and I can produce another zip including the library files.
5. Ensure folders `product-image/` and `product-datasheet/` exist and are writable by the webserver.
6. For bulk import: place referenced images in `product-image/import_files/` and datasheets in `product-datasheet/import_files/` before importing.
7. Default admin user isn't created in SQL for security — create an admin account manually (use PHP's password_hash to create password).

Files of interest:
- admin/ (admin panel)
- lib/mailer.php (mail wrapper)
- products.php, product.php (public)
- contact-handler.php
- site_schema.sql

If you want, I can create a follow-up zip that includes PHPMailer files so SMTP works without running composer.
