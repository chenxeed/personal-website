import grpc
from concurrent import futures
import time
import text_embedding_pb2_grpc
import text_embedding_pb2
from chromadb.utils import embedding_functions

class TextToEmbeddingServicer(text_embedding_pb2_grpc.TextToEmbeddingServicer):
    def __init__(self):
        self.default_ef = embedding_functions.DefaultEmbeddingFunction()

    def Convert(self, request, context):
        embeddings_list = self.default_ef(request.texts)
        embeddings = [text_embedding_pb2.Embedding(value=e) for e in embeddings_list]
        return text_embedding_pb2.EmbeddingResponse(embeddings=embeddings)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    text_embedding_pb2_grpc.add_TextToEmbeddingServicer_to_server(TextToEmbeddingServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == "__main__":
    serve()