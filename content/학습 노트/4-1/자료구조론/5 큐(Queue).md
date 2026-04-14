---
title: "[자료구조론] 5 큐(Queue)"
date: 2026-04-14
tags:
  - 컴퓨터사이언스
  - 자료구조론
draft: false
aliases:
---
# 큐 ADT

> [!NOTE] 큐
> 큐는 리스트의 한쪽 끝에서는 삽입이 일어나고, 반대쪽 끝에서는 삭제가 일어나는 순서 있는 리스트이다

**핵심 연산**
- **`Enqueue(Q, X)`**: 큐 $Q$의 가장 뒤(Rear)에 요소 $X$를 삽입한다
- **`Dequeue(Q)`**: 큐 $Q$의 가장 앞(Front)에 있는 요소를 삭제하고 반환한다

![[Pasted image 20260414213356.png|400]]

**FIFO(First-In, First-Out)**
먼저 들어온 데이터가 먼저 나가는 선입선출 방식이다



# 큐의 배열 구현
**구조 정의**
```C
#define MAX_QUEUE_SIZE 100 //큐의 최대 크기
typedef struct{
	int key;
} element;
element queue[MAX_QUEUE_SIZE];
int rear = -1; //마지막으로 삽입된 데이터의 위치를 가리킨다
int front = 0; //첫 번째 데이터(삭제될 데이터)의 위치를 가리킨다
```

![[Pasted image 20260414214034.png|400]]
- **빈 상태:** `rear < front` (초기값: `rear = -1`, `front = 0`)
- **데이터 삽입 시:** `rear`가 1씩 증가하며 데이터를 채운다
- **데이터 삭제 시:** `front`가 1씩 증가하며 다음 데이터를 가리킨다

## 핵심 연산의 구현
**Enqueue(삽입):**
데이터를 넣기 전, 큐가 가득 찼는지(`rear == MAX_QUEUE_SIZE - 1`) 확인한다. 공간이 있다면 `rear`를 한 칸 옮기고 그 자리에 데이터를 넣는다
```C
void Enqueue(ElementType item, ElementType* queue) {
    if (rear == MAX_QUEUE_SIZE - 1) {
        // 큐가 가득 참 (Full Condition)
        Error("Queue is full");
    } else {
        queue[++rear] = item; // rear를 증가시킨 후 저장
    }
}
```

![[Pasted image 20260414214648.png|400]]

**Dequeue(삭제):**
큐가 비어있는지 확인한 후, `front`가 가리키는 데이터를 반환하고 `front`를 다음 칸으로 이동시킨다
```C
ElementType Dequeue(ElementType* queue) {
    if (front > rear) {
        // 큐가 비어 있음 (Empty Condition)
        Error("Queue is empty");
    } else {
        return queue[front++]; // 현재 데이터를 반환하고 front 증가
    }
}
```

![[Pasted image 20260414214747.png|400]]


## 큐 ADT의 활용 예시
운영체제에서 우선순위가 없는 작업을 처리할 때 큐가 어떻게 사용되는지 보여주는 예시이다
- **원칙:** 먼저 요청된 작업이 먼저 처리되는 **FIFO(First-In, First-Out)** 방식을 따든다

![[Pasted image 20260414220615.png|400]]



# 원형 큐

> [!NOTE] 원형 큐
> 선형 큐에서 `rear`가 배열의 끝에 도달하면 앞부분이 비어있어도 데이터를 더 넣지 못하는 문제를 해결하기 위해 도입된 개념이다

**핵심 원리: Wrap Around**
- 배열의 끝(마지막 인덱스)에 도달했을 때, 다음 위치를 배열의 처음(인덱스 0)으로 되돌리는 방식이다
- 그림처럼 인덱스가 원형으로 연결되어 있다고 가정하고 `front`와 `rear`가 빙글빙글 돌며 이동한다

![[Pasted image 20260414220941.png|150]]
![[Pasted image 20260414220954.png|400]]

**구조체 정의**
```C
struct QueueRecord {
    int Capacity;       // 큐의 최대 용량
    int Front;          // 첫 번째 요소의 위치
    int Rear;           // 마지막 요소의 위치
    int Size;           // 현재 큐에 들어있는 요소의 개수
    ElementType *Array; // 데이터를 저장할 배열 포인터
};
```


## 원형 큐의 동작 과정
**초기 및 삽입:** 비어있는 원형 큐에 $a$를 넣으면 `rear`가 0번 칸을 가리킨다

![[Pasted image 20260414220941.png|150]]

**포화 상태(FULL):** $a$부터 $f$까지 모든 칸이 꽉 차면 `rear`가 한 바퀴 돌아 `front` 바로 직전까지 오게 된다

![[Pasted image 20260414221421.png|400]]

**삭제(Dequeue):**
$a$를 삭제하면 `front`가 0에서 1로 이동한다 $b$,$c$를 차례로 삭제하면 `front`가 계속 전진하며 다음 데이터를 가리킨다

![[Pasted image 20260414221607.png|400]]


## 원형 큐의 배열 구현
front와 rear가 배열의 끝에 도달하면, 다시 배열의 처음으로 돌아간다

![[Pasted image 20260414222147.png|400]]

**구조체 정의**
```C
struct QueueRecord {
    int Capacity;       // 큐가 가질 수 있는 최대 요소 개수
    int Front;          // 첫 번째 데이터의 인덱스
    int Rear;           // 마지막 데이터의 인덱스
    int Size;           // 현재 큐에 들어있는 데이터의 개수
    ElementType *Array; // 데이터를 저장할 배열을 가리키는 포인터
};
```

**MakeEmpty**
초기화 함수이다. 큐를 처음 생성하거나 비울 때 사용하는 함수이다
```C
void MakeEmpty(Queue Q){
	Q -> Size = 0; //데이터 개수를 0으로 초기화한다
	//초기 인덱스 설정이다
	Q -> Front = 1;
	Q -> Rear = 0;
}
```

![[Pasted image 20260414222708.png|200]]

**Enqueue**
삽입 연산이다. 데이터를 큐의 뒤에 추가하는 연산이다. 원형 큐의 핵심인 나머지 **나머지 연산($\%$)이** 등장한다
```C
void Enqueue(ElementType X, Queue Q) {
    if (IsFull(Q)) {
        Error("Full queue"); // 큐가 가득 찼으면 에러 출력
    } else {
        Q->Size++; // 1. 데이터 개수 1 증가

        /* 2. Rear 인덱스 갱신 (핵심!) */
        // 단순히 Rear++를 하면 배열 범위를 벗어날 수 있으므로
        // (현재 인덱스 + 1)을 최대 용량으로 나눈 나머지를 사용합니다.
        Q->Rear = (Q->Rear + 1) % Q->Capacity;

        // 3. 갱신된 Rear 위치에 데이터 저장
        Q->Array[Q->Rear] = X;
    }
}
```

![[Pasted image 20260414222734.png|150]]