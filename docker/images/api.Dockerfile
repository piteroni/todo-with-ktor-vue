FROM gradle:6.6.1-jdk11

RUN apt update && apt install -y zip

ARG KOTLIN_VERSION=1.4.32

SHELL ["/bin/bash", "-c"]

RUN curl -s https://get.sdkman.io | bash && \
    source "/root/.sdkman/bin/sdkman-init.sh" && \
    # kotlin repl
    sdk install kotlin ${KOTLIN_VERSION}

ENV TZ=Asia/Tokyo

WORKDIR /app

CMD ["bash"]