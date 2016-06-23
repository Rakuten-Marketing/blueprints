FROM centos:6.6 
MAINTAINER patrick henry <"patrick.henry@rakuten.com">
RUN yum -y update && yum -y install httpd && yum -y install epel-release
RUN yum -y clean all
RUN yum -y install nodejs
RUN yum -y install git
RUN yum install -y centos-release-SCL
RUN yum install -y python27
RUN yum install gcc-c++ patch readline readline-devel zlib zlib-devel libyaml-devel libffi-devel openssl-devel make bzip2 autoconf automake libtool bison iconv-devel
RUN yum -y install ruby
RUN yum -y install npm
RUN yum -y install rubygems
RUN yum install ruby-devel
RUN npm install -g bower
RUN gem install jekyll

ADD styleguide/ /var/www/html/
WORKDIR /var/www/html/
RUN bundle exec jekyll serve


ENV APACHE_RUN_USER apache 
ENV APACHE_RUN_GROUP apache 
ENV APACHE_LOG_DIR /etc/httpd/logs/ 


EXPOSE 80 
EXPOSE 443 
EXPOSE 9001
CMD ["/usr/sbin/apachectl", "-D", "FOREGROUND"]