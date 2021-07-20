import { EntityRepository, Repository } from 'typeorm';
import { Label } from '../entities/label.entity';

@EntityRepository(Label)
export class LabelRepository extends Repository<Label> {}
