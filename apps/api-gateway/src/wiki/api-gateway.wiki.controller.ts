import {Body, Controller, HttpCode, HttpException, HttpStatus, Post, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ApiGatewayWikiService} from "./api-gateway.wiki.service";
import AddArticleResponseDto from "../dto/wiki/add-article/add-article.response.dto";
import AddArticleRequestDto from "../dto/wiki/add-article/add-article.request.dto";
import CheckTokenGuard from "@app/common/guard/check-token.guard";
import ApproveArticleResponseDto from "../dto/wiki/approve-article/approve-article.response.dto";
import ApproveArticleRequestDto from "../dto/wiki/approve-article/approve-article.request.dto";
import {User} from "@app/common/decorator/get-user.decorator";
import JwtUserPayload from "@app/common/dto/common/jwt.payload";
import {UserPosition} from "@app/common/enum/user.position.enum";
import RejectArticleResponseDto from "../dto/wiki/reject-article/reject-article.response.dto";
import RejectArticleRequestDto from "../dto/wiki/reject-article/reject-article.request.dto";
import GetArticlesByTagsResponseDto from "../dto/wiki/get-articles-by-tags/get-articles-by-tags.response.dto";
import GetArticlesByTagsRequestDto from "../dto/wiki/get-articles-by-tags/get-articles-by-tags.request.dto";

@ApiTags('Wiki')
@Controller('wiki')
export class ApiGatewayWikiController {
    constructor(
        private readonly service: ApiGatewayWikiService
    ) {}

    @ApiOperation({ summary: 'send an article to moderation' })
    @Post('add-article')
    @ApiResponse({ type: AddArticleResponseDto })
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(CheckTokenGuard)
    async addArticle(@Body() dto: AddArticleRequestDto) {
        const result = (await this.service.addArticle(dto)) as any;
        if (!result.success)
            throw new HttpException(result.error.message, result.error.statusCode);
        return result.data;
    }

    @ApiOperation({ summary: 'approve article (devrels only)' })
    @Post('approve-article')
    @ApiResponse({ type: ApproveArticleResponseDto })
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(CheckTokenGuard)
    async approveArticle(@Body() dto: ApproveArticleRequestDto, @User() user: JwtUserPayload) {
        if (user.position != UserPosition.DEVREL) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        const result = (await this.service.approveArticle(dto)) as any;
        if (!result.success)
            throw new HttpException(result.error.message, result.error.statusCode);
        return result.data;
    }

    @ApiOperation({ summary: 'reject article (devrels only)' })
    @Post('reject-article')
    @ApiResponse({ type: RejectArticleResponseDto })
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(CheckTokenGuard)
    async rejectArticle(@Body() dto: RejectArticleRequestDto, @User() user: JwtUserPayload) {
        if (user.position != UserPosition.DEVREL) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        const result = (await this.service.rejectArticle(dto)) as any;
        if (!result.success)
            throw new HttpException(result.error.message, result.error.statusCode);
        return result.data;
    }

    @ApiOperation({ summary: 'get articles by tags' })
    @Post('get-articles/tags')
    @ApiResponse({ type: GetArticlesByTagsResponseDto })
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(CheckTokenGuard)
    async getArticlesByTags(@Body() dto: GetArticlesByTagsRequestDto) {
        if (!dto.tags) throw new HttpException('Tags array cannot be empty!', 400)
        const result = (await this.service.getArticlesByTags(dto)) as any;
        if (!result.success)
            throw new HttpException(result.error.message, result.error.statusCode);
        return result.data;
    }
}