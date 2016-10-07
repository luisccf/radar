# PlayCode - API Rest

[ ![Codeship Status for ismasantana/playcode-restapi](https://codeship.com/projects/f3c62c80-856f-0133-6c2a-269259d9f46d/status?branch=continuous-integration)](https://codeship.com/projects/122295)

---
## Instruções de compilação e execução

Usamos o Maven para gerir dependências e executar tarefas do projeto (compilar, limpar, empacotar etc.). Ele pode ser chamado de 2 formas diferentes:

1. A partir do NetBeans (botão "_Play_")
1. A partir da linha de comando (precisa instalar* o [Maven](https://maven.apache.org/download.cgi))

(1) No NetBeans, você deve escolhar qual perfil do Maven você quer ativar na hora de construir (_Build_) o projeto.

![Escolha do perfil do Maven na tela do NetBeans](docs/imgs/netbeans-maven-profiles.png)

O perfil escolhido (_e.g._, `dev-flavio`, `dev-rafael`, `int-heroku`) possui informações sobre a conectividade com o banco de dados: URL, usuário e senha.

(2) Para executar o programa em linha de comando, você precisa ter o Maven acessível pelo terminal e executar:

```
mvn clean package jetty:run -P dev-flavio
```

Para ter o Maven disponível, você pode colocar o caminho do executável do Maven que o NetBeans instalou disponível na variável de ambiente `Path` do Windows:

![](docs/imgs/putting-maven-on-path1.png)
![](docs/imgs/putting-maven-on-path2.png)
![](docs/imgs/putting-maven-on-path3.png)

- Veja um [tutorial de instalação do Maven](http://www.mkyong.com/maven/how-to-install-maven-in-windows/), caso precise

---
## Sobre o [Maven](https://en.wikipedia.org/wiki/Apache_Maven)

O Maven é um sistema para compilar código fonte de projetos muito usado no ecossistema da linguagem Java, sendo chamado de **ferramenta de automação de _build_**. Ele foi criado tendo como um dos objetivos substituir a ferramenta [Ant](https://en.wikipedia.org/wiki/Apache_Ant), que é a mesma usada pelo NetBeans.

Um projeto que usa o Maven é caracterizado por:

1. Um arquivo que descreve o projeto: o `pom.xml`
    - `pom` é a sigla para _Project Object Model_ (arquivo de projeto)
1. Uma estrutura de pastas padrão que segue o formato:
    - `projeto/`: é a pasta raiz
        - `/src/`: contém todo o código fonte
            - `/main/`: código fonte do programa
                - `/java/`: as pastas com código Java, hierarquizadas de acordo com os pacotes
                - `/resources/`: arquivos de configuração (`.xml`, `.properties` etc.)
            - `/test/`: contém código fonte dos testes automatizados, caso haja algum
                - `/java/`
                - `/resources/`
        - `/target/`
        - `pom.xml`

### O `pom.xml`

O POM (_Project Object Model_) descreve quais são as bibliotecas das quais seu projeto depende, com suas respectivas versões, bem como que _plugins_ são usados para construir (compilar) e empacotar (criar o `.jar` ou `.war`) o projeto.

Além disso, no POM existem também os **perfis de execução** (_profiles_), que contêm informação sobre o ambiente (_i.e._, desenvolvimento, integração, produção) onde o projeto está sendo executado.

Abrindo o arquivo, percebe-se a presença de alguns perfis, sendo um deles parecido com este:

```xml
<profile>
    <id>dev-flavio</id>
    <properties>
        <db.url>jdbc:mysql://localhost:3306/playcode?zeroDateTimeBehavior=convertToNull</db.url>
        <db.usuario>root</db.usuario>
        <db.senha>root</db.senha>
    </properties>
</profile>
```

Ao executar qualquer comando com o Maven, **podemos** definir qual perfil estamos ativando, colocandos o argumentos `-P nome_do_perfil` junto ao comando. Por exemplo, para compilar:

```
mvn compile -P dev-flavio
```

O impacto da escolha do perfil acontece no arquivo de configuração do Hibernate, o `persistence.xml`, que conterá a informação de conexão do perfil que foi ativado.

Caso nenhum perfil seja definido, por padrão, o perfil definido no `pom.xml` que contiver o elemento XML `<activeByDefault>true</activeByDefault>` será ativado.

### Ciclos de vida e fases

O Maven nos permite executar comandos com diferentes naturezas. Para separar os comandos, ele possui um conceito de **ciclo de vida**, que é uma sequência de **fases**.

Os ciclos de vida são: (a) _clean_, (b) _build_ (ou _default_) e (c) _site_ (referência no [site do Maven](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html#A_Build_Lifecycle_is_Made_Up_of_Phases)):

- _clean_ limpa os executáveis e arquivos temporários. É composto pelas fases:
    1. _pre-clean_
    1. _clean_
    1. _post_clean_
- _site_ gera documentação sobre o projeto
- _build_ constrói os artefatos executáveis do projeto. É composto por ~23 fases, sendo as mais notáveis:
    1. ...
    1. _compile_: chama o compilador Java (`javac`)
    1. ...
    1. _test_: executa os testes unitários
    1. ...
    1. **_package_**: empacota (_e.g._, cria o `.war`)
        - Nos interessa apenas até esta fase para o projeto PlayCode
    1. ...
    1. _install_: copia o pacote gerado para uma pasta chamada repositório local (`~/.m2/repository/`) para que ele possa ser usado como dependência de outros projetos
    1. ...
    1. _deploy_: implanta o pacote em produção

Ao executar `mvn nome_da_fase`, o Maven determina de qual ciclo de vida estamos falando e executa todas as fases anteriores até a `nome_da_fase` (incluindo). Ou seja,

```
mvn package
```

...vai executar todas as fases do ciclo _build_ até a fase `package`.

Tipicamente, usamos o Maven para limpar (_clean_) e depois empacotar (_build_) o projeto, usando os seguintes comandos:

```
mvn clean package -P dev-rafael
```

...lembrando que precisamos **ativar um perfil** para ter a configuração correta do arquivo de conexão com o banco (`persistence.xml`)

---
## _Workflow_ de Desenvolvimento

Usamos o `git` como nosso sistema de controle de versões (VCS) e também como ferramenta de integração contínua.

### Um dia de trabalho

Tipicamente, seguimos a seguinte rotina em um dia de trabalho:

1. Com o repositório limpo² (sem arquivos "sujos"):

    ```
    git pull --rebase
    ```

    - Isso fará com que a cópia local dos _branches_ do repositório remoto (no caso, do BitBucket) seja sincronizada com os nossos _branches_
    - Devemos fazer isso pelo menos uma vez por dia
    - ²: caso o repositório esteja "sujo" (com arquivos alterados e não "_commit_'ados"), você pode "guardá-los" na gaveta, fazer o `pull` e depois pegá-los de volta. A "gaveta" se chama _stash_ e a sequência de comandos ficaria:

        ```
        git stash
        git pull --rebase
        git stash pop
        ```

1. Trabalhamos no código, sempre dividindo o trabalho em pequenos _commits_, usando mensagens bem informativas sobre as alterações no código:

    ```
    git add -A
    ```
    ```
    git commit -m "Descrevendo workflow de trabalho no projeto"
    ```

    - Sempre use `git status` para ver como está a situação dos arquivos do repositório. Arquivos que aparecem **de vermelho estão "sujos"**; **de verde estão sujos e serão incluídos no próximo _commit_**
    - `git add -A` adiciona todos os arquivos alterados, incluídos ou excluídos para serem "_commmit_'ados" no próximo _commit_
        - Contudo, você pode adicionar arquivos individualmente usando:
            ```
            git add caminho/nome_do_arquivo.extensao
            ```
        - Repare que, ao fazer um `git status`, os arquivos que foram adicionados ficam verdinhos
    - `git commit -m "descricao"` faz um _commit_, salvando aquelas alterações no histórico
    - `git commit` sem o parâmetro `-m "descricao"` também funciona, e abre um editor de texto para que você redija a mensagem descritiva. Depois de escrever, basta salvar e fechar o editor (no Vi, digite `:wq` e aperte _Enter_)
    - Repare que ao fazer um `commit`, o `git` não alterou nada no repositório remoto (nem sequer acessou a Internet)
        - Isso significa que você pode fazer vários commits enquanto viaja de avião xD

1. Quando quiser enviar os _commits_ para o repositório remoto, você deve executar o comando (`git push`). Contudo, pode ser que alguém já tenha enviado novos _commits_ antes de você. Caso você faça um `push` nessas condições, o repositório remoto vai recusar o seu `push`. Assim, tipicamente, antes de fazer um `git push`, re-atualizamos nosso repositório com um `git pull`:

    ```
    git pull --rebase
    git push origin master
    ```

    - Ao fazer o `push`, o serviço de integração contínua vai executar, fazendo que o código do servidor de testes seja atualizado (veja próxima seção)

### Integração Contínua

Temos um serviço de integração contínua e um servidor de hospedagem gratuitos.

- Hospedagem do repositório `git`: [BitBucket](http://bitbucket.org)
    - URL do repositório: https://bitbucket.org/ismasantana/playcode-restapi
- Hospedagem do servidor de testes: [Heroku](http://heroku.com)
    - URL do servidor: https://playcode-restapi.herokuapp.com/
- Hospedagem do banco MySQL: [ClearDB](https://www.cleardb.com)
    - URL do servidor: mysql://bd48aff73f2825:a6f5d679@us-cdbr-iron-east-03.cleardb.net/heroku_af8af5445ee84b5?reconnect=true
    - String JDBC: jdbc:mysql://us-cdbr-iron-east-03.cleardb.net/heroku_af8af5445ee84b5?reconnect=true
    - Usuário: bd48aff73f2825
    - Senha: a6f5d679
- Serviço de integração contínua: [Codeship](http://codeship.com)
    - URL do projeto: https://codeship.com/projects/122295
