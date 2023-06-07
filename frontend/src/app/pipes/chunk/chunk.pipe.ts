import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'chunk' })
export class ChunkPipe implements PipeTransform {
  transform(value: any[], chunkSize: number): any[] {
    if (!value) return [];
    return Array(Math.ceil(value.length / chunkSize))
      .fill(0)
      .map((_, index) => index * chunkSize)
      .map(begin => value.slice(begin, begin + chunkSize));
  }
}