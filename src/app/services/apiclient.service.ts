import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';
import { Post } from '../model/post';
import { showAlertError, showToast } from '../tools/message-functions';
import { AuthService } from './auth.service';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class APIClientService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  apiUrl = 'http://localhost:3000';
  private intervalId: any;
  postList: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.startRefreshingPosts();
  }

  private startRefreshingPosts(): void {
    this.refreshPostList();
    this.intervalId = setInterval(() => {
      this.refreshPostList();
    }, 5000);
  }

  private async getNextId(): Promise<string> {
    const posts = await this.fetchPosts();
    if (posts.length === 0) return "1";
    const maxId = Math.max(...posts.map(p => parseInt(p.id.toString())));
    return (maxId + 1).toString();
  }

  async createPost(post: Post): Promise<Post | null> {
    try {
      const nextId = await this.getNextId();
      
      const currentUser = await this.authService.readAuthUser();
      const authorName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Usuario Anónimo';

      const postWithId = {
        id: nextId,
        title: post.title,
        body: post.body,
        author: authorName,
        date: new Date().toISOString().split('T')[0],
        authorImage: post.authorImage || '/api/placeholder/100/100'
      };

      console.log('Creando post con datos:', postWithId);
      
      const createdPost = await lastValueFrom(
        this.http.post<Post>(`${this.apiUrl}/posts`, postWithId, this.httpOptions)
        .pipe(
          timeout(5000),
          retry(2)
        )
      );
      
      showToast('Post creado correctamente');
      await this.refreshPostList();
      return createdPost;
    } catch (error) {
      console.error('Error al crear post:', error);
      showAlertError('APIClientService.createPost', error);
      return null;
    }
  }

  async updatePost(post: Post): Promise<Post | null> {
    try {
      const postId = post.id.toString();
      console.log('Actualizando post con ID:', postId);
      
      const updatedPost = await lastValueFrom(
        this.http.put<Post>(
          `${this.apiUrl}/posts/${postId}`,
          { ...post, id: postId },
          this.httpOptions
        ).pipe(
          timeout(5000),
          retry(2)
        )
      );

      showToast('Post actualizado correctamente');
      await this.refreshPostList();
      return updatedPost;
    } catch (error) {
      console.error('Error al actualizar post:', error);
      showAlertError('APIClientService.updatePost', 'Error al actualizar el post');
      return null;
    }
  }

  async deletePost(id: any): Promise<boolean> {
    try {
      const postId = id.toString();
      console.log('Eliminando post con ID:', postId);
      
      const response = await lastValueFrom(
        this.http.delete(
          `${this.apiUrl}/posts/${postId}`,
          this.httpOptions
        ).pipe(
          timeout(5000),
          retry(2)
        )
      );

      console.log('Respuesta del servidor:', response);
      showToast('Post eliminado correctamente');
      
      await this.refreshPostList();
      return true;
    } catch (error) {
      console.error('Error detallado al eliminar post:', error);
      showAlertError('APIClientService.deletePost', 'Error al eliminar el post');
      return false;
    }
  }

  async refreshPostList(): Promise<void> {
    try {
      const posts = await this.fetchPosts();
      console.log('Posts obtenidos:', posts);
      this.postList.next(posts);
    } catch (error) {
      console.error('Error al refrescar posts:', error);
    }
  }

  async fetchPosts(): Promise<Post[]> {
    try {
      console.log('Obteniendo posts de:', `${this.apiUrl}/posts`);
      const posts = await lastValueFrom(
        this.http.get<Post[]>(`${this.apiUrl}/posts`)
        .pipe(
          timeout(5000),
          retry(2)
        )
      );
      // Convertir todos los IDs a strings y ordenar
      return posts
        .map(post => ({
          ...post,
          id: post.id.toString()
        }))
        .sort((a, b) => parseInt(a.id) - parseInt(b.id));
    } catch (error) {
      console.error('Error al obtener posts:', error);
      return [];
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}