FROM gcc:latest
WORKDIR /app
COPY . .

RUN g++ -std=c++17 \
    src/server/server_main.cpp \
    src/FileManager/BlacklistFileManager.cpp \
    src/FileManager/BloomFilterFileManager.cpp \
    src/BloomFilter/BloomFilter.cpp \
    src/UrlCheck/url_blacklist.cpp \
    src/UrlCheck/url_validation.cpp \
    src/HashFunctions/HashFunctionFactory.cpp \
    src/HashFunctions/StdHash.cpp \
    src/HashFunctions/DoubleHash.cpp \
    src/requests/requestCheck.cpp \
    -o server -pthread

CMD ["sleep", "infinity"]
