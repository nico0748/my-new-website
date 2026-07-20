import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, TipBox, KeyPoints, Bridge, Figure, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "nestjs",
  title: "NestJS — TypeScript 製の本格 Web フレームワーク",
  description: "Module/Controller/Service と DI を軸に、大規模でも破綻しない構造を提供する NestJS。デコレータ、DTO とバリデーション、内部構造まで。",
  domain: "web",
  section: "backend",
  order: 10,
  level: "practice",
  tags: ["NestJS", "TypeScript", "DI"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>NestJS</strong> は、Express の「自由すぎて大規模だと散らかる」問題を解決するために生まれた、<strong>TypeScript 前提の本格フレームワーク</strong>です。Angular に似た <strong>Module / Controller / Service</strong> の構造と <strong>DI（依存性注入）</strong>を最初から強制し、チーム開発・長期運用でも破綻しにくい土台を提供します。
      </Lead>

      <Section>NestJS とは — Express との違い</Section>
      <p>
        Express は「ルーティングとミドルウェアだけ」の薄いフレームワークで、フォルダ構成もクラス設計も開発者に委ねられていました。NestJS は逆に、<strong>アプリの組み立て方を最初から型として決めています</strong>。デコレータ（<Cmd>@Controller</Cmd> など）で役割を宣言し、部品同士のつなぎ込みは DI が自動で行うため、規模が大きくなっても構造が一貫します。
      </p>
      <ComparisonTable
        headers={["観点", "Express", "NestJS"]}
        rows={[
          ["構造", "自由（自分で決める）", "規約で強制"],
          ["言語", "JS / TS どちらも", "TypeScript 前提"],
          ["DI", "なし", "標準搭載"],
          ["設計思想", "ミニマル", "Angular 風モジュラー"],
          ["向く規模", "小〜中", "中〜大"],
          ["内部", "本体そのもの", "既定は Express（Fastify も可）"],
        ]}
      />
      <Callout variant="info" title="内部は Express（または Fastify）">
        NestJS は Express を置き換えるものではなく、<strong>Express の上に構造を被せた層</strong>です。既定では内部で Express が動き、必要なら Fastify に差し替えて高速化できます。つまり前章の Express の知識はそのまま土台になります。
      </Callout>

      <Section>CLI でプロジェクトを作る</Section>
      <p>
        NestJS は公式 CLI が強力で、プロジェクトや部品の雛形をコマンドで生成できます。
      </p>
      <Steps>
        <Step title="CLI を導入">
          <Cmd>npm i -g @nestjs/cli</Cmd> でグローバルにインストールします。
        </Step>
        <Step title="プロジェクト作成">
          <Cmd>nest new my-app</Cmd> で TypeScript 構成一式が生成されます。
        </Step>
        <Step title="部品を生成">
          <Cmd>nest generate resource users</Cmd> で Module / Controller / Service と CRUD の雛形が一括で作られます。
        </Step>
      </Steps>

      <Figure src="/learn/shots/web/nestjs-01.svg" alt="nest generate resource users の実行結果" caption="CLI 1 コマンドで Module / Controller / Service / DTO が一式生成される" />

      <Section>アーキテクチャ — Module / Controller / Provider</Section>
      <p>
        NestJS のアプリは 3 種類の部品の組み合わせで出来ています。役割を分けることで、テストしやすく変更に強い構造になります。
      </p>
      <KVList
        items={[
          { key: "Module", val: "関連する部品をまとめる箱。アプリは Module の集合" },
          { key: "Controller", val: "HTTP リクエストを受け、レスポンスを返す（薄く保つ）" },
          { key: "Provider / Service", val: "ビジネスロジック・DB アクセスの本体" },
        ]}
      />

      <Bridge course="ソフトウェア工学 / アーキテクチャ">
        Controller / Service / （その下の Repository）という分け方は、講義で学ぶ<strong>レイヤードアーキテクチャ</strong>（プレゼンテーション層 → アプリケーション層 → データアクセス層）の実装形です。上位の層は下位の層を「呼ぶ」だけで、逆向きの依存を持たない——この<strong>単方向の依存</strong>が、変更の波及を抑え「モジュール性（高凝集・疎結合）」を保ちます。Controller を薄く保つ設計指針は、「表示ロジックとビジネスロジックを混ぜない」という関心の分離の原則そのものです。
      </Bridge>

      <Code lang="text" filename="リクエストの流れ">{`HTTP リクエスト
   │
   ▼
[ Controller ]  … ルーティング。受け取って Service を呼ぶだけ
   │ 呼び出し（DI で注入された Service）
   ▼
[ Service ]     … ロジック本体。計算・DB アクセス
   │
   ▼
   結果を Controller が返す → レスポンス`}</Code>

      <FlowChain
        nodes={[
          { label: "Request", variant: "alt" },
          { label: "Guard", sub: "認可" },
          { label: "Pipe", sub: "検証/変換" },
          { label: "Controller" },
          { label: "Service" },
        ]}
        caption="NestJS のリクエストライフサイクル"
      />

      <SubSection>Controller — 入口</SubSection>
      <Code lang="typescript" filename="users.controller.ts">{`import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("users") // → /users 以下を担当
export class UsersController {
  // DI: UsersService が自動で注入される
  constructor(private readonly usersService: UsersService) {}

  @Get() // GET /users
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id") // GET /users/:id
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Post() // POST /users
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}`}</Code>

      <SubSection>Service — ロジック本体</SubSection>
      <Code lang="typescript" filename="users.service.ts">{`import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable() // これで DI の対象になる
export class UsersService {
  private users = [{ id: 1, name: "Alice" }];
  private nextId = 2;

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException("user not found");
    return user;
  }

  create(dto: CreateUserDto) {
    const user = { id: this.nextId++, name: dto.name };
    this.users.push(user);
    return user;
  }
}`}</Code>

      <SubSection>Module — 部品をまとめる</SubSection>
      <Code lang="typescript" filename="users.module.ts">{`import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController], // この Module が持つ Controller
  providers: [UsersService],      // DI に登録する Provider
  exports: [UsersService],        // 他 Module から使わせたい場合
})
export class UsersModule {}`}</Code>

      <Section>DI（依存性注入）の仕組み</Section>
      <p>
        NestJS の中核が <strong>DI（Dependency Injection）</strong>です。<Cmd>UsersController</Cmd> は <Cmd>UsersService</Cmd> を使いますが、<strong>自分で <Cmd>new UsersService()</Cmd> しません</strong>。コンストラクタに型を書いておくだけで、NestJS が該当インスタンスを探して<strong>自動で注入</strong>します。
      </p>

      <Code lang="typescript" filename="DI の対比">{`// DI なし（Express 風）: 自分で生成 → 結合が固い・差し替えにくい
class UsersController {
  private service = new UsersService(); // ハードコード
}

// DI あり（NestJS）: 型を宣言するだけ。生成・供給は Nest 任せ
class UsersController {
  constructor(private readonly service: UsersService) {}
}`}</Code>

      <p>
        NestJS は起動時に、<Cmd>@Injectable()</Cmd> が付いた Provider を <strong>IoC コンテナ</strong>に登録します。あるクラスが別のクラスを必要とすると、コンテナが依存を解決してインスタンスを渡します（既定では<strong>シングルトン</strong>＝アプリ全体で 1 つ）。
      </p>

      <Callout variant="tip" title="DI がうれしい理由">
        テスト時に本物の Service の代わりに<strong>モック</strong>を注入できる、依存関係が constructor に明示され追いやすい、インスタンスが使い回されて無駄がない、といった利点があります。大規模になるほど効いてきます。
      </Callout>

      <Bridge course="デザインパターン / オブジェクト指向設計">
        DI は<strong> IoC（制御の反転）</strong>の代表的な実現方法で、<strong>依存性逆転の原則（DIP・SOLID の D）</strong>を形にしたものです。「上位モジュールが下位の<em>具象</em>クラスに依存せず、<em>抽象（インターフェース）</em>に依存する」——NestJS では <Cmd>constructor(private svc: UserRepository)</Cmd> のように抽象トークンで受け取り、実体（本番用 DB 実装／テスト用モック）は IoC コンテナが差し込みます。「オブジェクトの生成責務を利用者から外部へ移す」という講義の Factory / Service Locator の議論が、そのまま <Cmd>@Injectable()</Cmd> と IoC コンテナに対応します。
      </Bridge>

      <SubSection>スコープ — 既定はシングルトン</SubSection>
      <p>
        IoC コンテナに登録された Provider は既定で<strong>シングルトン</strong>（アプリ全体で 1 インスタンス）です。状態を持たない Service ならこれで効率的ですが、リクエストごとに状態を分けたい場合は <Cmd>@Injectable(&#123; scope: Scope.REQUEST &#125;)</Cmd> でリクエストスコープに変えられます。ただしリクエストスコープはインスタンスが都度生成され性能に影響するため、必要な箇所に限定します。
      </p>

      <Section>デコレータ — 役割を宣言する記法</Section>
      <p>
        NestJS の見た目を特徴づけるのが<strong>デコレータ</strong>（<Cmd>@...</Cmd>）です。クラスやメソッド、引数に「これは何か」というメタ情報を付与し、NestJS がそれを読んで動作を組み立てます。
      </p>
      <ComparisonTable
        headers={["デコレータ", "付ける場所", "意味"]}
        rows={[
          ["@Module()", "クラス", "モジュール定義"],
          ["@Controller()", "クラス", "コントローラ（+ ベースパス）"],
          ["@Injectable()", "クラス", "DI 対象の Provider"],
          ["@Get() / @Post()", "メソッド", "HTTP メソッド + ルート"],
          ["@Param() / @Query()", "引数", "パラメータ / クエリを注入"],
          ["@Body()", "引数", "リクエストボディを注入"],
        ]}
      />
      <TipBox>
        Express で <Cmd>req.params.id</Cmd> と書いていたものが、NestJS では <Cmd>@Param(&quot;id&quot;) id: string</Cmd> と引数に直接受け取れます。デコレータが「どこから値を取るか」を宣言的に表現しています。
      </TipBox>

      <p>
        デコレータは<strong>クラスやメソッドに「メタデータ」を貼り付ける</strong>だけで、それ自体は何もしません。実際に動くのは、起動時に NestJS がそのメタデータを<strong>リフレクション</strong>で読み取り、ルーティング表や DI グラフを組み立てるからです。「宣言（何であるか）」と「解釈（どう動かすか）」を分離しているのがポイントです。
      </p>

      <Bridge course="プログラミング言語 / メタプログラミング">
        デコレータは<strong>アノテーション（注釈）によるメタプログラミング</strong>の一例で、Java のアノテーション + リフレクション、Python のデコレータと同じ発想です。「コードにタグを付け、フレームワークが実行時にそのタグを走査して振る舞いを合成する」という宣言的プログラミングのモデルは、言語処理系やアスペクト指向（AOP）の講義で扱う考え方に対応します。<Cmd>emitDecoratorMetadata</Cmd> により<strong>型情報を実行時に残す</strong>点も、静的な型が動的なディスパッチに使われる興味深い例です。
      </Bridge>

      <Section>DTO と class-validator でバリデーション</Section>
      <p>
        <strong>DTO（Data Transfer Object）</strong>は、リクエストで受け取るデータの<strong>形（型）</strong>を表すクラスです。<Cmd>class-validator</Cmd> のデコレータを付けると、入力の検証を宣言的に書けます。
      </p>

      <Code lang="typescript" filename="dto/create-user.dto.ts">{`import { IsString, IsEmail, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;
}`}</Code>

      <p>
        <Cmd>ValidationPipe</Cmd> を有効にすると、上の制約に違反するリクエストは<strong>自動で 400 エラー</strong>になります。Controller には検証済みの安全なデータだけが届きます。
      </p>

      <Code lang="typescript" filename="main.ts">{`import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全ルートに検証を適用。whitelist は未定義プロパティを除去
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();`}</Code>

      <Section>パイプとガード</Section>
      <p>
        NestJS はリクエスト処理の各段階に差し込める仕組みを持ちます。代表が<strong>パイプ</strong>と<strong>ガード</strong>です。
      </p>
      <KVList
        items={[
          { key: "Pipe（パイプ）", val: "入力の変換・検証。ValidationPipe や ParseIntPipe など" },
          { key: "Guard（ガード）", val: "ハンドラを実行してよいかの判定。認証・認可に使う" },
        ]}
      />

      <Code lang="typescript" filename="pipe-and-guard.ts">{`import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";

@Controller("users")
export class UsersController {
  // ParseIntPipe: "42"(string) を 42(number) に変換 + 数値チェック
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return { id };
  }

  // AuthGuard が false を返すと 403 で弾かれる
  @UseGuards(AuthGuard)
  @Get("secret")
  secret() {
    return { ok: true };
  }
}`}</Code>

      <Callout variant="info" title="リクエストが通る順序">
        NestJS では <strong>ミドルウェア → ガード → パイプ → ハンドラ → インターセプタ → 例外フィルタ</strong> という決まった順序でリクエストが流れます。各段階の責務が分かれているため、認証はガード・変換はパイプ、と置き場所が明確です。
      </Callout>

      <Section>全体像 — ルート Module にまとめる</Section>
      <p>
        機能ごとの Module をルートの <Cmd>AppModule</Cmd> に登録して、アプリが完成します。ツリー状に Module を組み合わせるのが NestJS の設計思想です。
      </p>

      <Code lang="typescript" filename="app.module.ts">{`import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [UsersModule], // 機能 Module をぶら下げる
})
export class AppModule {}`}</Code>

      <Callout variant="tip" title="いつ NestJS を選ぶか">
        「小さな API を素早く」なら Express で十分です。<strong>複数人で長く運用する・機能が増え続ける・型で守りたい</strong>アプリなら、最初の学習コストを払ってでも NestJS の構造が効いてきます。土台は同じ Node.js なので、Node と Express の理解が前提知識としてそのまま活きます。
      </Callout>

      <Callout variant="warn" title="実務でハマりやすい点">
        <strong>循環依存</strong>（A が B を、B が A を注入）で起動時にエラーになりがちです。<Cmd>forwardRef()</Cmd> で回避できますが、多くは<strong>設計の見直しサイン</strong>——共通ロジックを別 Provider に切り出すのが筋です。また Provider を <Cmd>providers</Cmd> に登録し忘れると <Cmd>Nest can&apos;t resolve dependencies</Cmd> エラー、他 Module から使うには <Cmd>exports</Cmd> が必要、という「登録漏れ」も頻出です。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "NestJS は Express の自由さを構造で締めた TypeScript 前提のフレームワーク。内部は Express（or Fastify）",
          "Module（箱）/ Controller（入口）/ Service（ロジック）に責務を分割する",
          "DI で依存を自動注入。new せず constructor に型を書くだけ。テスト・保守に強い",
          "デコレータ（@Controller / @Get / @Injectable など）で役割を宣言的に表現",
          "DTO + class-validator + ValidationPipe で入力検証、ガードで認証、パイプで変換を担う",
        ]}
      />
    </>
  );
}
