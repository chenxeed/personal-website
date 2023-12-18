// Original file: ../embedder/text_embedding.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  EmbeddingResponse as _text_to_embedding_EmbeddingResponse,
  EmbeddingResponse__Output as _text_to_embedding_EmbeddingResponse__Output,
} from '../text_to_embedding/EmbeddingResponse';
import type {
  TextRequest as _text_to_embedding_TextRequest,
  TextRequest__Output as _text_to_embedding_TextRequest__Output,
} from '../text_to_embedding/TextRequest';

export interface TextToEmbeddingClient extends grpc.Client {
  Convert(
    argument: _text_to_embedding_TextRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_text_to_embedding_EmbeddingResponse__Output>,
  ): grpc.ClientUnaryCall;
  Convert(
    argument: _text_to_embedding_TextRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_text_to_embedding_EmbeddingResponse__Output>,
  ): grpc.ClientUnaryCall;
  Convert(
    argument: _text_to_embedding_TextRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_text_to_embedding_EmbeddingResponse__Output>,
  ): grpc.ClientUnaryCall;
  Convert(
    argument: _text_to_embedding_TextRequest,
    callback: grpc.requestCallback<_text_to_embedding_EmbeddingResponse__Output>,
  ): grpc.ClientUnaryCall;
  convert(
    argument: _text_to_embedding_TextRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_text_to_embedding_EmbeddingResponse__Output>,
  ): grpc.ClientUnaryCall;
  convert(
    argument: _text_to_embedding_TextRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_text_to_embedding_EmbeddingResponse__Output>,
  ): grpc.ClientUnaryCall;
  convert(
    argument: _text_to_embedding_TextRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_text_to_embedding_EmbeddingResponse__Output>,
  ): grpc.ClientUnaryCall;
  convert(
    argument: _text_to_embedding_TextRequest,
    callback: grpc.requestCallback<_text_to_embedding_EmbeddingResponse__Output>,
  ): grpc.ClientUnaryCall;
}

export interface TextToEmbeddingHandlers
  extends grpc.UntypedServiceImplementation {
  Convert: grpc.handleUnaryCall<
    _text_to_embedding_TextRequest__Output,
    _text_to_embedding_EmbeddingResponse
  >;
}

export interface TextToEmbeddingDefinition extends grpc.ServiceDefinition {
  Convert: MethodDefinition<
    _text_to_embedding_TextRequest,
    _text_to_embedding_EmbeddingResponse,
    _text_to_embedding_TextRequest__Output,
    _text_to_embedding_EmbeddingResponse__Output
  >;
}
