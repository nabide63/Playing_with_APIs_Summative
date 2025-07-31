FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js and nginx
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
        curl openssh-server sudo iputils-ping ca-certificates nginx && \
    mkdir /run/sshd && \
    if ! id -u ubuntu >/dev/null 2>&1; then \
        useradd --create-home --uid 1000 --shell /bin/bash ubuntu; \
    fi && \
    echo 'ubuntu:pass123' | chpasswd && \
    usermod -aG sudo ubuntu && \
    sed -ri 's/#?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config && \
    sed -ri 's/#?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy application files
COPY . /var/www/html

# Configure nginx
RUN echo 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /var/www/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ =404;\n\
    }\n\
}' > /etc/nginx/sites-available/default


EXPOSE 3000 22 80

RUN ssh-keygen -A

# Create startup script to run nginx, Node.js app and sshd
RUN echo '#!/bin/bash\n\
echo "Starting nginx..."\n\
service nginx start\n\
echo "Starting CycleCare application..."\n\
echo "Starting SSH daemon..."\n\
/usr/sbin/sshd -D' > /startup.sh && \
    chmod +x /startup.sh

CMD ["/startup.sh"]