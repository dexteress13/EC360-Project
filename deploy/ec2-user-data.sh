#!/bin/bash
# Paste this into "User data" (Advanced details) when launching the EC2 instance.
# Amazon Linux 2023. Installs nginx and points it at /var/www/revmatch/current.
set -eux

dnf install -y nginx unzip
mkdir -p /var/www/revmatch/releases
mkdir -p /var/www/revmatch/releases/initial
echo '<h1>RevMatch - waiting for the first deployment</h1>' > /var/www/revmatch/releases/initial/index.html
ln -sfn /var/www/revmatch/releases/initial /var/www/revmatch/current
chmod -R a+rX /var/www/revmatch

cat > /etc/nginx/nginx.conf <<'NGINX'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events { worker_connections 1024; }

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    access_log    /var/log/nginx/access.log;
    sendfile      on;

    server {
        listen 80 default_server;
        server_name _;
        root /var/www/revmatch/current;
        index index.html;

        # React Router: unknown paths fall back to the app
        location / {
            try_files $uri /index.html;
        }

        # Always fresh, so the pipeline's verify step sees the new build immediately
        location = /version.txt {
            add_header Cache-Control "no-store";
            default_type text/plain;
        }
    }
}
NGINX

systemctl enable --now nginx
