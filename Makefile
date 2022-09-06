# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: adelille <adelille@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/03/10 14:54:46 by adelille          #+#    #+#              #
#    Updated: 2022/09/06 18:21:06 by adelille         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME =	ft_transcendence

FRONT =	./frontend
BACK =	./backend

ENV =		.env
BACKENV =	$(BACK)/src/common/envs/development.env

# **************************************************************************** #
#	MAKEFILE	#

#include	srcs/.env
#export	$(shell sed 's/=.*//' srcs/.env)

include $(ENV)
$(eval export $(shell sed -ne 's/ *#.*$$//; /./ s/=.*$$// p' $(ENV)))

SHELL := bash

B =		$(shell tput bold)
RED =	$(shell tput setaf 1)
GRE =	$(shell tput setaf 2)
YEL =	$(shell tput setaf 3)
D =		$(shell tput sgr0)

# *************************************************************************** #
#	RULES	#

all:	$(NAME)

$(NAME):
	docker-compose up --force-recreate --build

db:
	docker-compose up --force-recreate --build db

back:
	[ -d $(BACK)/node_modules ] || npm --prefix $(BACK) install $(BACK)
	npm --prefix $(BACK) run start:dev

front:
	[ -d $(FRONT)/node_modules ] || npm --prefix $(FRONT) install $(FRONT) --legacy-peer-deps
	npm --prefix $(FRONT) start

stop:
	docker-compose down

clean:	stop
	docker system prune --volumes -f

fclean: clean
	docker system prune -af

re:		clean all

fre:	fclean all

list:
	@printf "\n\t$(B)$(GRE)containers$(D)\n"
	@docker ps -a
	@printf "\n\t$(B)$(GRE)images$(D)\n"
	@docker images -a
	@printf "\n\t$(B)$(GRE)networks$(D)\n"
	@docker network ls
	@printf "\n\t$(B)$(GRE)volumes$(D)\n"
	@docker volume ls
	@echo ;

.PHONY: all db back front stop clean fclean re fre list

# **************************************************************************** #
