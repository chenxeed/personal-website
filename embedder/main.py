import grpc
from concurrent import futures
import time
from sentence_transformers import SentenceTransformer
import text_embedding_pb2_grpc  # Replace with your actual module name
import text_embedding_pb2  # Replace with your actual module name

class TextToEmbeddingServicer(text_embedding_pb2_grpc.TextToEmbeddingServicer):
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def Convert(self, request, context):
        embedding = self.model.encode(request.text)
        return text_embedding_pb2.EmbeddingResponse(embedding=embedding)

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