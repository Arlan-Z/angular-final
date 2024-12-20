import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ArticleListConfig } from "../models/article-list-config.model";
import { Article } from "../models/article.model";

@Injectable({ providedIn: "root" })
export class ArticlesService {
  private mockArticles: Article[] = [
    {
      slug: "mock-article-1",
      title: "Mock Article 1",
      description: "This is a mock article 1 description",
      body: "Content of mock article 1",
      tagList: ["mock", "test"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorited: false,
      favoritesCount: 0,
      author: {
        username: "mockauthor1",
        bio: "Mock bio",
        image: "https://via.placeholder.com/150",
        following: false,
      },
    },
    {
      slug: "mock-article-2",
      title: "Mock Article 2",
      description: "This is a mock article 2 description",
      body: "Content of mock article 2",
      tagList: ["mock", "example"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorited: true,
      favoritesCount: 10,
      author: {
        username: "mockauthor2",
        bio: "Mock bio",
        image: "https://via.placeholder.com/150",
        following: true,
      },
    },
  ];

  query(
    config: ArticleListConfig,
  ): Observable<{ articles: Article[]; articlesCount: number }> {
    return of({
      articles: this.mockArticles,
      articlesCount: this.mockArticles.length,
    });
  }

  get(slug: string): Observable<Article> {
    const article = this.mockArticles.find((article) => article.slug === slug);
    return of(article!);
  }

  delete(slug: string): Observable<void> {
    this.mockArticles = this.mockArticles.filter(
      (article) => article.slug !== slug,
    );
    return of(undefined);
  }

  create(article: Partial<Article>): Observable<Article> {
    const newArticle: Article = {
      ...article,
      slug: `mock-article-${this.mockArticles.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorited: false,
      favoritesCount: 0,
      tagList: article.tagList || [],
      author: {
        username: "mockauthor",
        bio: "Mock bio",
        image: "https://via.placeholder.com/150",
        following: false,
      },
    } as Article;

    this.mockArticles.push(newArticle);
    return of(newArticle);
  }

  update(article: Partial<Article>): Observable<Article> {
    const index = this.mockArticles.findIndex((a) => a.slug === article.slug);
    if (index !== -1) {
      this.mockArticles[index] = {
        ...this.mockArticles[index],
        ...article,
      } as Article;
      return of(this.mockArticles[index]);
    }
    throw new Error("Article not found");
  }

  favorite(slug: string): Observable<Article> {
    const article = this.mockArticles.find((article) => article.slug === slug);
    if (article) {
      article.favorited = true;
      article.favoritesCount++;
      return of(article);
    }
    throw new Error("Article not found");
  }

  unfavorite(slug: string): Observable<void> {
    const article = this.mockArticles.find((article) => article.slug === slug);
    if (article) {
      article.favorited = false;
      article.favoritesCount--;
      return of(undefined);
    }
    throw new Error("Article not found");
  }
}
