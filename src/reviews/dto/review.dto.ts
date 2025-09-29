import { ImageRequest } from 'src/images/dto/image.dto';

export class ReviewRequest {
  name: string;
  text: string;
  image: ImageRequest[];
}
