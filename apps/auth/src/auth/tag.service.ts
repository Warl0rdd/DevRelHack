import { Injectable } from '@nestjs/common';
import TagEntity from '../db/entities/tags.entity';
import { In } from 'typeorm';
import RMQResponseMessageTemplate from '../../../../libs/common/src/dto/common/rmq.response.message-template';
import GetTagsResponseMessageData from '../../../../libs/common/src/dto/auth-service/get-tags/get-tags.response.message-data';

@Injectable()
export default class TagService {
  constructor() {}

  public async addMissingTags(tags: string[]) {
    const tagEntities = await TagEntity.find({
      where: {
        name: In(tags),
      },
    });

    const tagsMap = new Map<string, boolean>();
    for (const tag of tags) {
      tagsMap.set(tag, true);
    }

    for (const tagEntity of tagEntities) {
      if (tagsMap.get(tagEntity.name) === true) {
        tagsMap.set(tagEntity.name, false);
      }
    }

    const newTagEntites = [];
    for (const [tag, value] of tagsMap.entries()) {
      if (value === true) {
        const tagEntity = new TagEntity();
        tagEntity.name = tag;
        newTagEntites.push(tagEntity);
      }
    }

    await TagEntity.save(newTagEntites);

    return TagEntity.find({
      where: {
        name: In(tags),
      },
    });
  }

  public async getAllTags(): Promise<
    RMQResponseMessageTemplate<GetTagsResponseMessageData>
  > {
    const tags = await TagEntity.find().then((data) =>
      data.map((item) => item.name),
    );
    return {
      success: true,
      data: {
        tags,
      },
    };
  }
}
