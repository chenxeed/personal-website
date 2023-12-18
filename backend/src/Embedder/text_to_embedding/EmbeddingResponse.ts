// Original file: ../embedder/text_embedding.proto

import type {
  Embedding as _text_to_embedding_Embedding,
  Embedding__Output as _text_to_embedding_Embedding__Output,
} from '../text_to_embedding/Embedding';

export interface EmbeddingResponse {
  embeddings?: _text_to_embedding_Embedding[];
}

export interface EmbeddingResponse__Output {
  embeddings: _text_to_embedding_Embedding__Output[];
}
