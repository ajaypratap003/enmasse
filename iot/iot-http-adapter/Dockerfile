FROM quay.io/enmasse/java-base:11-4

ARG version
ARG maven_version
ARG commit
ENV VERSION=${version} COMMIT=${commit} MAVEN_VERSION=${maven_version}

ADD target/iot-http-adapter-${maven_version}.jar /iot-http-adapter.jar

ENV JAVA_LAUNCH_PROFILE=openjdk-11
CMD ["/opt/run-java/launch_java.sh", "/iot-http-adapter.jar"]
