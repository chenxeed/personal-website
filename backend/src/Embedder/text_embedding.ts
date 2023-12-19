import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  TextToEmbeddingClient as _text_to_embedding_TextToEmbeddingClient,
  TextToEmbeddingDefinition as _text_to_embedding_TextToEmbeddingDefinition,
} from './text_to_embedding/TextToEmbedding';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype,
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  text_to_embedding: {
    Embedding: MessageTypeDefinition;
    EmbeddingResponse: MessageTypeDefinition;
    TextRequest: MessageTypeDefinition;
    TextToEmbedding: SubtypeConstructor<
      typeof grpc.Client,
      _text_to_embedding_TextToEmbeddingClient
    > & { service: _text_to_embedding_TextToEmbeddingDefinition };
  };
}
